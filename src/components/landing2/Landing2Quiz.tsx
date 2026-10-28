'use client';

import { useEffect, useRef, useState } from 'react';
import { submitLead } from '@/lib/lead-intake-client';
import { PRIMARY_CONSENT_KEY, type LeadField } from '@/lib/lead-envelope';
import { L2_CONSENT_BODY } from './legal-texts';
import {
  LANDING2_QUIZ_STEPS,
  L2_QUIZ_DEFAULTS,
  type Landing2QuizProps,
  type Landing2QuizStep,
} from './content';

export interface Landing2QuizOverlayProps extends Partial<Landing2QuizProps> {
  onClose: () => void;
  /**
   * Текст согласия на передачу данных в РФ — приходит со страницы
   * «Согласие на обработку персональных данных» (секция CMS `consent`,
   * `/legal/personal-data-consent`), а не из подписей квиза: документ,
   * под которым ставят галочку, и документ на странице — один и тот же.
   */
  transferConsentText?: string;
}

/** Какое из двух согласий открыто попапом. */
type ConsentDoc = 'data' | 'transfer';

type Phase = 'quiz' | 'name' | 'phone' | 'thanks';
type Grade = 'A' | 'B' | 'C';
type Answers = Record<string, string | string[] | undefined>;

const TOTAL = LANDING2_QUIZ_STEPS.length;

/**
 * Продуктовая логика результата — перенесена один-в-один из прототипа
 * (`docs/landing-2.zip`, `TOLK Global - Landing.dc.html`, функция
 * `grade()`), README §«Логика результата квиза». Это не юридическая
 * проверка, а правила заказчика: при изменении программ правится только
 * эта функция. Значения ответов (`none`, `lt1500`, …) заданы в
 * `LANDING2_QUIZ_STEPS` и в CMS не редактируются — там только подписи.
 */
export function gradeQuiz(answers: Answers): Grade {
  const act = (answers['activity'] as string[] | undefined) ?? [];
  const src = (answers['source'] as string[] | undefined) ?? [];
  const inc = answers['income'] as string | undefined;
  const st = answers['stability'] as string | undefined;
  const who = answers['who'] as string | undefined;

  const noActivity = act.length === 1 && act[0] === 'none';
  const noIncomeSource = src.length === 1 && src[0] === 'none';
  const passiveOnly = src.length === 1 && src[0] === 'passive';
  const veryEarly = st === 'planned' || st === 'lt3' || st === 'irregular';

  if ((noActivity || noIncomeSource) && (inc === 'lt1500' || veryEarly)) return 'C';
  if (inc === 'lt1500' && veryEarly) return 'C';
  if (
    inc === 'lt1500' ||
    inc === 'i1500' ||
    veryEarly ||
    st === 'm3_6' ||
    noActivity ||
    noIncomeSource ||
    passiveOnly ||
    (who === 'family' && inc === 'i2500')
  ) {
    return 'B';
  }
  return 'A';
}

function countDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length;
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Короткая подпись у галочки, часть которой открывает попап с полным
 * текстом. Ссылкой становится подстрока `linkText` внутри `label` — так
 * редактор в CMS правит обычную фразу, а не собирает подпись из кусков.
 * Не нашлась (например, подпись переписали, а подстроку забыли) —
 * ссылка добавляется следом, но не пропадает: без неё человек не сможет
 * прочитать то, под чем ставит галочку.
 */
function ConsentLabel({
  label,
  linkText,
  href,
  onOpen,
}: {
  label: string;
  linkText: string;
  /** Куда ведёт ссылка, если JS не сработал или её открыли в новой
   *  вкладке: страница с тем же документом. */
  href: string;
  onOpen: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  // Именно <a>, а не <button>: кнопка в браузере — атомарный
  // инлайн-блок, она не переносится вместе с соседним текстом и на
  // узком экране уезжает на свою строку целиком (поймано на скриншоте
  // мобильного). Плюс ссылку можно открыть в новой вкладке.
  const trigger = (
    <a
      className="l2-quiz-consent-link"
      href={href}
      onClick={(event) => {
        // Обычный клик — попап поверх квиза, чтобы не потерять ответы;
        // Ctrl/⌘-клик и средняя кнопка открывают страницу как обычно.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onOpen(event);
      }}
    >
      {linkText}
    </a>
  );
  if (!linkText) return <>{label}</>;
  const at = label.indexOf(linkText);
  if (at < 0) {
    return (
      <>
        {label} {trigger}
      </>
    );
  }
  return (
    <>
      {label.slice(0, at)}
      {trigger}
      {label.slice(at + linkText.length)}
    </>
  );
}

/** Текст второй галочки редактируется в CMS одним textarea — абзацы
 *  разделены пустой строкой, как и везде в этом разделе. */
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function Landing2Quiz({
  onClose,
  transferConsentText = L2_CONSENT_BODY,
  ...overrides
}: Landing2QuizOverlayProps) {
  // Все подписи — дефолты хендоффа, перекрытые тем, что сохранено в CMS.
  const t: Landing2QuizProps = { ...L2_QUIZ_DEFAULTS, ...stripEmpty(overrides) };

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  // Согласия хранятся не как boolean, а как момент отметки: в CRM уходит
  // время, когда человек поставил галочку, а не время отправки формы
  // (между ними он ещё дописывает телефон). `null` — не отмечено.
  const [consentData, setConsentData] = useState<string | null>(null);
  const [consentTransfer, setConsentTransfer] = useState<string | null>(null);
  const [openDoc, setOpenDoc] = useState<ConsentDoc | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  // Куда вернуть фокус после закрытия попапа с текстом согласия — на ту
  // ссылку, с которой его открыли (их две).
  const docTriggerRef = useRef<HTMLElement | null>(null);
  const consentsGiven = consentData !== null && consentTransfer !== null;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      // Открыт текст согласия — Escape закрывает сначала его, а не весь
      // тест вместе с уже введёнными ответами.
      if (openDoc) {
        closeDoc();
        return;
      }
      onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, openDoc]);

  // Фокус переводится в оверлей при открытии; возврат на кнопку-триггер
  // делает Landing2Page (она знает, откуда квиз открыли).
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const current: Landing2QuizStep = LANDING2_QUIZ_STEPS[Math.min(step, TOTAL - 1)]!;
  const asking = phase === 'quiz' && step < TOTAL;
  const done = phase === 'quiz' && step >= TOTAL;
  const grade = done ? gradeQuiz(answers) : null;

  function pick(value: string) {
    if (current.multi) {
      setAnswers((prev) => {
        const list = ((prev[current.id] as string[] | undefined) ?? []).slice();
        const at = list.indexOf(value);
        if (at >= 0) list.splice(at, 1);
        else list.push(value);
        return { ...prev, [current.id]: list };
      });
      return;
    }
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
    setStep((prev) => prev + 1);
  }

  function openDocFor(doc: ConsentDoc, event: React.MouseEvent<HTMLAnchorElement>) {
    docTriggerRef.current = event.currentTarget;
    setOpenDoc(doc);
  }

  function closeDoc() {
    setOpenDoc(null);
    docTriggerRef.current?.focus();
  }

  function goBack() {
    setFailed(false);
    if (phase === 'phone') {
      setPhase('name');
      return;
    }
    if (phase === 'name') {
      setPhase('quiz');
      return;
    }
    setStep((prev) => Math.max(0, prev - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setPhase('quiz');
    setName('');
    setPhone('');
    setFailed(false);
    // Согласие дают к конкретной отправке — «пройти заново» начинает её
    // с нуля, галочки снимаются вместе с ответами.
    setConsentData(null);
    setConsentTransfer(null);
  }

  /**
   * Отправка — общий `submitLead()` (он же у форм и квиза лендинга-1):
   * конверт собирает сервер, отсюда уходят только ответы, контакты и то,
   * что доступно лишь браузеру (UTM и текущий URL). Поведение при сбое —
   * как у квиза лендинга-1 (`design-system/overlays/Quiz.tsx`): экран
   * контактов остаётся с сообщением и запасной ссылкой в Telegram, а не
   * показывает «спасибо» за неотправленную заявку.
   */
  async function submitContacts() {
    // Кнопка и так заблокирована без обеих галочек — это второй рубеж на
    // случай, если её когда-нибудь разблокируют по другой ветке: заявка
    // без согласия уходить в CRM не должна в принципе.
    if (consentData === null || consentTransfer === null) return;
    setSending(true);
    setFailed(false);
    const fields: LeadField[] = LANDING2_QUIZ_STEPS.map((quizStep) => ({
      key: quizStep.id,
      label: quizStep.crmLabel,
      value: answerLabels(quizStep, answers[quizStep.id], t).join(', '),
    }));
    fields.push({ key: 'quiz_outcome', label: 'Результат теста', value: grade });

    const submission = await submitLead({
      formId: 'landing2-quiz',
      name,
      contactRaw: phone,
      fields,
      consent: true,
      // Текст — тот, что был на экране (из CMS), а не копия в коде:
      // доказательством служит именно прочитанная человеком редакция.
      consents: [
        {
          key: PRIMARY_CONSENT_KEY,
          label: 'Согласие на обработку ПД',
          granted: true,
          at: consentData,
          version: t.consentVersion,
          text: t.consentDataText,
        },
        {
          key: 'cross_border_ru',
          label: 'Согласие на передачу данных в РФ (CRM)',
          granted: true,
          at: consentTransfer,
          version: t.consentVersion,
          text: transferConsentText,
        },
      ],
    });
    setSending(false);

    if (!submission.ok) {
      setFailed(true);
      return;
    }
    setPhase('thanks');
  }

  const stepLabel =
    phase === 'thanks'
      ? t.progressDoneLabel
      : phase === 'name' || phase === 'phone'
        ? t.progressContactsLabel
        : asking
          ? `${step + 1} / ${TOTAL}`
          : t.progressResultLabel;

  const chosen = current.multi ? ((answers[current.id] as string[] | undefined) ?? []) : [];

  return (
    <div
      className="l2-quiz"
      role="dialog"
      aria-modal="true"
      aria-label="Тест: проверьте свои шансы"
      tabIndex={-1}
      ref={dialogRef}
    >
      <div className="l2-quiz-bar">
        <span className="l2-quiz-step-label">{stepLabel}</span>
        <div className="l2-quiz-progress" aria-hidden="true">
          {LANDING2_QUIZ_STEPS.map((quizStep, index) => (
            <span
              key={quizStep.id}
              className={index < step ? 'l2-quiz-dot l2-quiz-dot--done' : 'l2-quiz-dot'}
            />
          ))}
        </div>
        <button type="button" className="l2-quiz-close" onClick={onClose}>
          {t.closeLabel}
        </button>
      </div>

      {asking && (
        <div className="l2-quiz-screen">
          <h2 className="l2-quiz-title">{String(t[current.questionKey])}</h2>
          <p className="l2-quiz-hint">{String(t[current.hintKey])}</p>
          <div className="l2-quiz-options">
            {current.options.map((option) => {
              const on = current.multi
                ? chosen.includes(option.value)
                : answers[current.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className="l2-quiz-option"
                  aria-pressed={on}
                  onClick={() => pick(option.value)}
                >
                  {/* Галочка видна только у выбранного варианта (цвет
                      прозрачный у остальных) — для скринридера состояние
                      несёт aria-pressed на самой кнопке, не этот символ. */}
                  <span
                    className={on ? 'l2-quiz-mark l2-quiz-mark--on' : 'l2-quiz-mark'}
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{String(t[option.labelKey])}</span>
                </button>
              );
            })}
          </div>
          {current.multi && (
            <button
              type="button"
              className="l2-btn l2-quiz-next"
              disabled={chosen.length === 0}
              onClick={() => setStep((prev) => prev + 1)}
            >
              {t.nextLabel}
            </button>
          )}
          {step > 0 && (
            <button type="button" className="l2-btn-link l2-btn-link--quiet" onClick={goBack}>
              {t.backLabel}
            </button>
          )}
        </div>
      )}

      {done && grade && (
        <div className="l2-quiz-screen">
          <div className="l2-quiz-result-head">
            <img src="/landing-2/tolk-excl.png" alt="" loading="lazy" />
            <h2 className="l2-quiz-result-title">
              {grade === 'A' ? t.resultATitle : grade === 'B' ? t.resultBTitle : t.resultCTitle}
            </h2>
          </div>
          <p className="l2-quiz-lead">
            {grade === 'A' ? t.resultALead : grade === 'B' ? t.resultBLead : t.resultCLead}
          </p>
          <div className="l2-dash-rule" aria-hidden="true" />
          <div className="l2-quiz-actions">
            {grade !== 'C' && (
              <button type="button" className="l2-btn" onClick={() => setPhase('name')}>
                {t.bookLabel}
              </button>
            )}
            <a className="l2-btn-link" href={t.guidesHref} onClick={onClose}>
              {t.guidesLabel}
            </a>
          </div>
          <button type="button" className="l2-btn-link l2-btn-link--quiet" onClick={restart}>
            {t.restartLabel}
          </button>
        </div>
      )}

      {phase === 'name' && (
        <div className="l2-quiz-screen">
          <h2 className="l2-quiz-title">{t.nameTitle}</h2>
          <input
            className="l2-quiz-input"
            type="text"
            value={name}
            placeholder={t.namePlaceholder}
            autoComplete="name"
            aria-label={t.nameTitle}
            onChange={(event) => setName(event.target.value)}
          />
          <button
            type="button"
            className="l2-btn l2-quiz-next"
            disabled={name.trim().length < 2}
            onClick={() => setPhase('phone')}
          >
            {t.nextLabel}
          </button>
          <button type="button" className="l2-btn-link l2-btn-link--quiet" onClick={goBack}>
            {t.backLabel}
          </button>
        </div>
      )}

      {phase === 'phone' && (
        <div className="l2-quiz-screen">
          <h2 className="l2-quiz-title">{t.phoneTitle}</h2>
          <p className="l2-quiz-hint">{t.phoneHint}</p>
          <input
            className="l2-quiz-input"
            type="tel"
            value={phone}
            placeholder={t.phonePlaceholder}
            autoComplete="tel"
            aria-label={t.phoneTitle}
            onChange={(event) => setPhone(event.target.value)}
          />
          {/* Два согласия — отдельными галочками в выделенной рамке:
              грузинский закон требует, чтобы согласие, соседствующее с
              другими положениями, было ясно выделено, а передача данных
              в страну без признанных гарантий была отдельным согласием,
              а не частью общего. Обе сняты по умолчанию — предзаполненная
              галочка согласием не считается. */}
          <div className="l2-quiz-consents">
            <div className="l2-quiz-consent-item">
              <input
                id="l2-consent-data"
                type="checkbox"
                className="l2-quiz-checkbox"
                checked={consentData !== null}
                onChange={(event) => setConsentData(event.target.checked ? nowIso() : null)}
              />
              <label className="l2-quiz-consent-text" htmlFor="l2-consent-data">
                <ConsentLabel
                  label={t.consentDataLabel}
                  linkText={t.consentDataLinkText}
                  href={t.consentPrivacyHref}
                  onOpen={(event) => openDocFor('data', event)}
                />
              </label>
            </div>
            <div className="l2-quiz-consent-item">
              <input
                id="l2-consent-transfer"
                type="checkbox"
                className="l2-quiz-checkbox"
                checked={consentTransfer !== null}
                onChange={(event) => setConsentTransfer(event.target.checked ? nowIso() : null)}
              />
              <label className="l2-quiz-consent-text" htmlFor="l2-consent-transfer">
                <ConsentLabel
                  label={t.consentTransferLabel}
                  linkText={t.consentTransferLinkText}
                  href={t.consentConsentHref}
                  onOpen={(event) => openDocFor('transfer', event)}
                />
              </label>
            </div>
            <p className="l2-quiz-consent">
              {t.consentRevokeNote}{' '}
              {/* target="_blank" — обязательно: квиз это оверлей с живым
                  состоянием, переход по ссылке в той же вкладке стёр бы
                  уже введённые ответы. */}
              {t.consentPrivacyLabel && t.consentPrivacyHref && (
                <a href={t.consentPrivacyHref} target="_blank" rel="noopener">
                  {t.consentPrivacyLabel}
                </a>
              )}
              {t.consentPrivacyLabel &&
                t.consentPrivacyHref &&
                t.consentConsentLabel &&
                t.consentConsentHref &&
                ' · '}
              {t.consentConsentLabel && t.consentConsentHref && (
                <a href={t.consentConsentHref} target="_blank" rel="noopener">
                  {t.consentConsentLabel}
                </a>
              )}
            </p>
          </div>
          {failed && (
            <p className="l2-quiz-error" role="alert">
              {t.errorNote}{' '}
              <a href={t.thanksTelegramHref} target="_blank" rel="noopener">
                {t.thanksTelegramLabel}
              </a>
            </p>
          )}
          <button
            type="button"
            className="l2-btn l2-quiz-next"
            disabled={sending || countDigits(phone) < 9 || !consentsGiven}
            onClick={() => void submitContacts()}
          >
            {sending ? t.sendingLabel : t.submitLabel}
          </button>
          <button type="button" className="l2-btn-link l2-btn-link--quiet" onClick={goBack}>
            {t.backLabel}
          </button>
        </div>
      )}

      {openDoc && (
        // Попап поверх оверлея квиза: полный текст согласия открывается
        // здесь, а не ссылкой на страницу — переход в той же вкладке стёр
        // бы уже введённые ответы, а лишняя вкладка перед самой отправкой
        // сбивает. Та же страница всё равно доступна ссылкой ниже.
        <div
          className="l2-quiz-doc"
          role="dialog"
          aria-modal="true"
          aria-label={openDoc === 'data' ? t.consentDataTitle : t.consentTransferTitle}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDoc();
          }}
        >
          <div className="l2-quiz-doc-card">
            <h3 className="l2-quiz-doc-title">
              {openDoc === 'data' ? t.consentDataTitle : t.consentTransferTitle}
            </h3>
            <div className="l2-quiz-doc-text">
              {splitParagraphs(openDoc === 'data' ? t.consentDataText : transferConsentText).map(
                (paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ),
              )}
            </div>
            <button type="button" className="l2-btn l2-btn--sm" onClick={closeDoc} autoFocus>
              {t.closeLabel}
            </button>
          </div>
        </div>
      )}

      {phase === 'thanks' && (
        <div className="l2-quiz-screen">
          <h2 className="l2-quiz-title">{t.thanksTitle}</h2>
          <div className="l2-dash-rule" aria-hidden="true" />
          <div className="l2-quiz-actions">
            <a className="l2-btn" href={t.thanksTelegramHref} target="_blank" rel="noopener">
              {t.thanksTelegramLabel}
            </a>
            <button type="button" className="l2-btn-link" onClick={onClose}>
              {t.thanksBackLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Подписи выбранных вариантов — для конверта лида (в CRM уходит текст, не коды). */
function answerLabels(
  step: Landing2QuizStep,
  value: string | string[] | undefined,
  texts: Landing2QuizProps,
): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.map((one) => {
    const option = step.options.find((candidate) => candidate.value === one);
    return option ? String(texts[option.labelKey]) : one;
  });
}

/**
 * Из CMS приходят только те поля, что реально заполнены: пустая строка и
 * `null` (поле очистили) не должны затирать дефолт хендоффа пустотой —
 * иначе кнопка или заголовок квиза просто исчезнут с экрана.
 */
function stripEmpty(values: Partial<Landing2QuizProps>): Partial<Landing2QuizProps> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'string' && value.trim()) result[key] = value;
  }
  return result as Partial<Landing2QuizProps>;
}
