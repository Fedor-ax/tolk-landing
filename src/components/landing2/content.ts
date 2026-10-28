/**
 * Контент лендинга-2 — типы пропсов всех секций и дефолты, дословно
 * взятые из дизайн-хендоффа (`docs/landing-2.zip`,
 * `design_handoff_tolk_landing 2/TOLK Global - Landing.dc.html` +
 * `README.md`).
 *
 * Файл намеренно БЕЗ `'use client'`, хотя все секции лендинга —
 * клиентские: дефолты импортирует серверный `src/lib/landing2-sections.ts`
 * (схема форм CMS), а импорт значения из `'use client'`-модуля в
 * серверный код отдаёт клиентскую заглушку вместо самого объекта — та же
 * причина, по которой у лендинга-1 заведены отдельные `*-content.ts`
 * (см. `src/components/design-system/sections/hero-content.ts`). Здесь
 * дефолты всех 13 секций лежат одним файлом, а не по файлу на секцию:
 * их читает ровно один потребитель на серверной стороне.
 *
 * Что редактируется в CMS, а что нет: тексты — да (все поля ниже),
 * структура — нет. В частности, у квиза значения вариантов
 * (`remote`, `lt1500`, …) зашиты в `LANDING2_QUIZ_STEPS` и связаны с
 * `gradeQuiz()` в `Landing2Quiz.tsx` — в CMS правятся только подписи.
 */

import { L2_CONSENT_BODY, L2_LEGAL_BODY, L2_PRIVACY_BODY } from './legal-texts';

/* ── Общие ссылки хендоффа (README §«Ссылки») ───────────────────────── */

export const TELEGRAM_MANAGER_URL = 'https://t.me/tolk_manager';
export const TELEGRAM_CHANNEL_URL = 'https://t.me/tolkglobal';
export const INSTAGRAM_URL = 'https://www.instagram.com/tolk.global';

/* ── SEO ────────────────────────────────────────────────────────────── */

export type Landing2SeoProps = {
  title: string;
  description: string;
  /** Путь к загруженному favicon (`/media/…`) — пусто, иконка не задаётся. */
  faviconSrc: string;
};

export const L2_SEO_DEFAULTS: Landing2SeoProps = {
  title: 'TOLK Global — маршрут легального переезда в Европу',
  description:
    'Консалтинг по легальному переезду: подбираем страну и программу под вашу ситуацию и ведём весь путь от разбора кейса до карты резидента.',
  faviconSrc: '',
};

/**
 * Якорь на странице → ключ секции, которая под ним живёт. Нужна ровно
 * для одного: когда секцию выключают в CMS, ссылка на неё в меню шапки
 * должна исчезнуть вместе с ней, а не вести в никуда
 * (`Landing2Page.tsx` считает по этой карте `hiddenAnchors`). Якоря, не
 * перечисленные здесь (редактор может вписать свой), не трогаются.
 */
export const SECTION_ANCHORS: Record<string, string> = {
  '#top': 'hero',
  '#how': 'how',
  '#countries': 'countries',
  '#cases': 'cases',
  '#faq': 'faq',
};

/* ── Юридические страницы ───────────────────────────────────────────── */

export type Landing2LegalKey = 'legal' | 'privacy' | 'consent';

export interface Landing2LegalPageDef {
  /** Ключ секции в CMS (`landing2_sections.key`) — он же ключ схемы формы. */
  key: Landing2LegalKey;
  /** Публичный адрес страницы. Задан ровно здесь: отсюда его берут и
   *  роут (`src/app/legal/[[...slug]]/page.tsx`), и дефолтные ссылки
   *  подвала, и строка согласия в квизе. */
  path: string;
  /** Как страница называется в CMS (`/admin/landing-2`). */
  adminLabel: string;
  /** Подпись ссылки в строке подвала «© TOLK GLOBAL LTD · Legal · …». */
  footerLabel: string;
}

/**
 * Три юридические страницы лендинга-2. Набор фиксирован (это не
 * произвольные страницы CMS, а конкретные документы, на которые ссылаются
 * подвал и форма квиза), поэтому живёт в коде, а в CMS правятся заголовок
 * и текст каждой — см. `src/lib/landing2-sections.ts`.
 */
export const LANDING2_LEGAL_PAGES: readonly Landing2LegalPageDef[] = [
  {
    key: 'legal',
    path: '/legal',
    adminLabel: 'Legal / Реквизиты',
    footerLabel: 'Legal',
  },
  {
    key: 'privacy',
    path: '/legal/privacy-policy',
    adminLabel: 'Политика конфиденциальности',
    footerLabel: 'Privacy Policy',
  },
  {
    key: 'consent',
    path: '/legal/personal-data-consent',
    adminLabel: 'Согласие на обработку персональных данных',
    footerLabel: 'Personal Data Consent',
  },
];

export function legalPagePath(key: Landing2LegalKey): string {
  return LANDING2_LEGAL_PAGES.find((page) => page.key === key)!.path;
}

export type Landing2LegalPageProps = {
  title: string;
  /** Текст документа в разметке Markdown (рендерится react-markdown —
   *  тем же способом, что страницы лендинга-1, без dangerouslySetInnerHTML). */
  body: string;
};

/**
 * Дефолты юридических страниц. Сами тексты — в `legal-texts.ts`
 * (длинные документы заказчика, правятся по другому поводу, чем контент
 * лендинга); здесь только заголовки, под которыми они показываются.
 *
 * Дефолт, а не строка в БД: доступа к прод-базе у разработки нет, а
 * дефолты приезжают деплоем и при этом остаются правимыми в CMS — форма
 * открывается уже заполненной ими, сохранение перекрывает
 * (`getLanding2SectionValues`).
 */
export const L2_LEGAL_DEFAULTS: Landing2LegalPageProps = {
  title: 'Legal / Реквизиты',
  body: L2_LEGAL_BODY,
};

export const L2_PRIVACY_DEFAULTS: Landing2LegalPageProps = {
  title: 'Политика конфиденциальности и обработки персональных данных',
  body: L2_PRIVACY_BODY,
};

export const L2_CONSENT_DEFAULTS: Landing2LegalPageProps = {
  title: 'Согласие на обработку персональных данных',
  body: L2_CONSENT_BODY,
};

export const L2_LEGAL_DEFAULTS_BY_KEY: Record<Landing2LegalKey, Landing2LegalPageProps> = {
  legal: L2_LEGAL_DEFAULTS,
  privacy: L2_PRIVACY_DEFAULTS,
  consent: L2_CONSENT_DEFAULTS,
};

/**
 * Адрес страницы → её ключ. Единственный резолвер маршрута `/legal/*`
 * (роут `src/app/legal/[[...slug]]/page.tsx`): всё, чего нет в
 * `LANDING2_LEGAL_PAGES`, отдаёт 404.
 */
export function legalKeyForSlug(slug: string[] | undefined): Landing2LegalKey | null {
  const path = slug && slug.length > 0 ? `/legal/${slug.join('/')}` : '/legal';
  return LANDING2_LEGAL_PAGES.find((page) => page.path === path)?.key ?? null;
}

/* ── Шапка ──────────────────────────────────────────────────────────── */

export interface Landing2NavItem {
  label: string;
  anchor: string;
}

export type Landing2HeaderProps = {
  ctaText: string;
  nav: Landing2NavItem[];
};

export const L2_HEADER_DEFAULTS: Landing2HeaderProps = {
  ctaText: 'Узнать свои шансы',
  nav: [
    { label: 'Как это работает', anchor: '#how' },
    { label: 'Направления', anchor: '#countries' },
    { label: 'Кейсы', anchor: '#cases' },
    { label: 'FAQ', anchor: '#faq' },
  ],
};

/* ── Hero ───────────────────────────────────────────────────────────── */

export type Landing2HeroProps = {
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  secondaryText: string;
  secondaryHref: string;
  trustExperience: string;
  trustCountries: string;
  /** Пусто — на месте фото рендерится нейтральный плейсхолдер. */
  photoSrc: string;
  /** Выключено в CMS — арка с фото не рендерится вовсе (карточка-ремарка
   *  остаётся, она текст, а не картинка). */
  photoVisible: boolean;
  photoAlt: string;
  noteTitle: string;
  noteText: string;
};

export const L2_HERO_DEFAULTS: Landing2HeroProps = {
  badge: 'Консалтинг по легальному переезду',
  title: 'Маршрут в Европу, который подходит именно вам',
  subtitle:
    'Мы не оформляем визы. Мы находим страну и программу под вашу ситуацию и ведём весь путь: от разбора кейса до карты резидента.',
  ctaText: 'Узнать свои шансы',
  secondaryText: 'Написать специалисту',
  secondaryHref: TELEGRAM_MANAGER_URL,
  trustExperience: 'В миграционной сфере с 2022 года',
  trustCountries: 'Германия, Испания, Португалия, Франция, Италия, Сербия',
  photoSrc: '',
  photoVisible: true,
  photoAlt: 'Клиент TOLK Global в европейском городе',
  noteTitle: 'Скажем честно',
  noteText: 'Если сейчас не подходит ни одна программа — так и скажем.',
};

/* ── «Мы не визовый центр» ──────────────────────────────────────────── */

export type Landing2NotVisaProps = {
  title: string;
  paragraph: string;
  /** Второй абзац — выделенная вставка с пунктирной рамкой слева. */
  highlight: string;
};

export const L2_NOT_VISA_DEFAULTS: Landing2NotVisaProps = {
  title: 'Мы не визовый центр',
  paragraph:
    'Визовые центры оформляют документы под программу, которую вы уже выбрали. Мы решаем задачу раньше: какая программа вообще вам подходит. Иногда это Freiberufler в Германии, иногда Digital Nomad Visa в Португалии, а иногда сначала нужна временная остановка в Сербии, чтобы уже оттуда податься на визу цифрового кочевника в Италии.',
  highlight:
    'Если по вашей ситуации сейчас не подходит ни одна программа, мы так и скажем и объясним, что изменить, чтобы через несколько месяцев подошла.',
};

/* ── Как это работает ───────────────────────────────────────────────── */

export interface Landing2Step {
  title: string;
  description: string;
}

export type Landing2HowProps = {
  title: string;
  steps: Landing2Step[];
};

export const L2_HOW_DEFAULTS: Landing2HowProps = {
  title: 'Как это работает',
  steps: [
    {
      title: 'Диагностика',
      description:
        'Смотрим на вашу ситуацию: доход, гражданство, состав семьи, срочность. Подбираем один-два реалистичных варианта, а не длинный список программ на будущее.',
    },
    {
      title: 'Договор',
      description: 'Фиксируем программу, стоимость и условия. Доплат по ходу дела не будет.',
    },
    {
      title: 'Подача',
      description:
        'Готовим документы, проверяем каждую бумагу перед подачей, сопровождаем на встречах с ведомствами.',
    },
    {
      title: 'Карточка',
      description:
        'Вы получаете резидентскую карту. Дальше при необходимости помогаем с продлением, ПМЖ или гражданством.',
    },
  ],
};

/* ── Направления ────────────────────────────────────────────────────── */

export interface Landing2Country {
  country: string;
  program: string;
  description: string;
  fact: string;
}

export type Landing2CountriesProps = {
  title: string;
  intro: string;
  items: Landing2Country[];
  /** Жирное начало строки блока-CTA под аккордеоном. */
  ctaLead: string;
  ctaText: string;
  ctaButton: string;
};

export const L2_COUNTRIES_DEFAULTS: Landing2CountriesProps = {
  title: 'Направления',
  intro:
    'Каждая страна работает по своим правилам, поэтому маршрут собираем под конкретную программу, а не по шаблону.',
  items: [
    {
      country: 'Германия',
      program: 'Freiberufler',
      description:
        'Для фрилансеров и независимых специалистов с доходом от клиентов в разных странах.',
      fact: 'Путь к ПМЖ или гражданству через 5 лет',
    },
    {
      country: 'Германия',
      program: 'Chancenkarte',
      description: 'Карта поиска работы для квалифицированных специалистов.',
      fact: 'Подходит, если вы ещё ищете работодателя в Германии',
    },
    {
      country: 'Испания / Португалия / Италия',
      program: 'Digital Nomad Visa',
      description:
        'Для удалённых сотрудников и предпринимателей с доходом от зарубежных источников.',
      fact: 'Требования к доходу и документам различаются по странам',
    },
    {
      country: 'Франция',
      program: 'Talent Passport',
      description: 'Для предпринимателей, инвесторов и представителей творческих профессий.',
      fact: 'Статус выдают сразу на несколько лет',
    },
    {
      country: 'Сербия',
      program: 'ВНЖ через ИП',
      description:
        'Быстрый легальный статус, в том числе как промежуточный шаг перед подачей в другую страну.',
      fact: 'Часто первый шаг в более длинном маршруте',
    },
  ],
  ctaLead: 'Не знаете, что вам подходит?',
  ctaText: 'Пройдите тест — 3 минуты, и мы скажем, какие варианты стоит рассматривать.',
  ctaButton: 'Узнать свои шансы',
};

/* ── Почему TOLK ────────────────────────────────────────────────────── */

export interface Landing2Stat {
  value: string;
  label: string;
  description: string;
}

export type Landing2WhyProps = {
  title: string;
  stats: Landing2Stat[];
  refundText: string;
};

export const L2_WHY_DEFAULTS: Landing2WhyProps = {
  title: 'Почему TOLK',
  stats: [
    {
      value: '4+',
      label: 'лет опыта команды в миграционной сфере',
      description: 'Работаем с людьми, которые переезжают в Европу с 2022 года',
    },
    {
      value: '300+',
      label: 'кейсов за плечами команды',
      description:
        'Ещё до того, как появился бренд TOLK Global — точную цифру подставить перед публикацией',
    },
  ],
  refundText:
    'Если по объективным причинам заявку отклонят, деньги возвращаем. Это прописано в договоре, а не обещание на словах.',
};

/* ── Кейсы ──────────────────────────────────────────────────────────── */

export interface Landing2Case {
  program: string;
  quote: string;
  /** Пусто — мини-плейсхолдер вместо фото. */
  photoSrc: string;
  /** Выключено в CMS — мини-фото не рендерится вовсе, в строке автора
   *  остаются только имя и подпись. */
  photoVisible: boolean;
  name: string;
  caption: string;
}

export type Landing2CasesProps = {
  title: string;
  notice: string;
  items: Landing2Case[];
};

export const L2_CASES_DEFAULTS: Landing2CasesProps = {
  title: 'Что говорят клиенты',
  notice:
    'Заготовка структуры карточек. Перед публикацией заменить на реальные кейсы клиентов и их фото.',
  items: [
    {
      program: 'Германия · Freiberufler',
      quote:
        '«Я думала, что с доходом фрилансера мне ничего не светит. Мне честно сказали: пока рано, вот что нужно докрутить за три месяца. Через полгода уже подала документы.»',
      photoSrc: '',
      photoVisible: true,
      name: 'Имя клиента',
      caption: 'страна / программа',
    },
    {
      program: 'Сербия → Италия',
      quote:
        '«Хотела Италию, а по факту через Сербию получилось быстрее и спокойнее. Мне объяснили логику, а не просто продали ту программу, которую я сама придумала.»',
      photoSrc: '',
      photoVisible: true,
      name: 'Имя клиента',
      caption: 'страна / программа',
    },
  ],
};

/* ── Мини-CTA перед FAQ ─────────────────────────────────────────────── */

export type Landing2MiniCtaProps = {
  title: string;
  text: string;
  buttonText: string;
};

export const L2_MINI_CTA_DEFAULTS: Landing2MiniCtaProps = {
  title: 'Сомневаетесь, какая программа ваша?',
  text: 'Тест на 3 минуты покажет, какие варианты стоит рассматривать именно вам.',
  buttonText: 'Пройти тест',
};

/* ── FAQ ────────────────────────────────────────────────────────────── */

export interface Landing2FaqItem {
  question: string;
  answer: string;
}

export type Landing2FaqProps = {
  title: string;
  items: Landing2FaqItem[];
};

export const L2_FAQ_DEFAULTS: Landing2FaqProps = {
  title: 'FAQ',
  items: [
    {
      question: 'Сколько стоит переезд с TOLK?',
      answer:
        'Стоимость зависит от программы и вашей ситуации, поэтому называем её после разбора кейса, а не одной цифрой для всех. Это честнее, чем средняя цена, которая всё равно не будет точной для вас.',
    },
    {
      question: 'Вы гарантируете, что визу одобрят?',
      answer:
        'Одобрение решает ведомство другой страны, а не мы, поэтому стопроцентных гарантий никто честно дать не может. Что можем мы: собрать сильную заявку и прописать в договоре возврат денег при отказе по объективным причинам.',
    },
    {
      question: 'Сколько времени занимает процесс?',
      answer:
        'От разбора кейса до подачи обычно уходит несколько месяцев, в зависимости от программы и вашей готовности. Сроки рассмотрения устанавливают ведомства, повлиять на них мы не можем, поэтому даём ориентиры, а не точные даты.',
    },
    {
      question: 'Что если мне ничего не подходит прямо сейчас?',
      answer:
        'Тогда скажем прямо и объясним, что изменить в ситуации, чтобы через несколько месяцев одна из программ подошла.',
    },
  ],
};

/* ── Финальный CTA ──────────────────────────────────────────────────── */

export type Landing2FinalCtaProps = {
  title: string;
  text: string;
  quizButtonText: string;
  telegramText: string;
  telegramHref: string;
};

export const L2_FINAL_CTA_DEFAULTS: Landing2FinalCtaProps = {
  title: 'Готовы разобраться с маршрутом?',
  text: 'Пройдите тест или напишите миграционному специалисту напрямую в Telegram.',
  quizButtonText: 'Узнать свои шансы',
  telegramText: 'Написать в Telegram',
  telegramHref: TELEGRAM_MANAGER_URL,
};

/* ── Подвал ─────────────────────────────────────────────────────────── */

export type Landing2FooterIcon = 'telegram' | 'instagram';

export interface Landing2FooterLink {
  label: string;
  href: string;
  icon: Landing2FooterIcon;
}

/** Ссылка нижней строки подвала — без иконки, в отличие от соцсетей выше. */
export interface Landing2LegalLink {
  label: string;
  href: string;
}

export type Landing2FooterProps = {
  tagline: string;
  links: Landing2FooterLink[];
  disclaimer: string;
  /** Левая часть нижней строки подвала. */
  copyright: string;
  /** Правая часть той же строки — ссылки на юридические страницы.
   *  Пустой список — строка остаётся, в ней только копирайт. */
  legalLinks: Landing2LegalLink[];
};

export const L2_FOOTER_DEFAULTS: Landing2FooterProps = {
  tagline: 'Маршрут легального переезда в Европу',
  links: [
    { label: 'Telegram-канал: t.me/tolkglobal', href: TELEGRAM_CHANNEL_URL, icon: 'telegram' },
    {
      label: 'Написать менеджеру: t.me/tolk_manager',
      href: TELEGRAM_MANAGER_URL,
      icon: 'telegram',
    },
    { label: 'Instagram: tolk.global', href: INSTAGRAM_URL, icon: 'instagram' },
  ],
  disclaimer:
    'Сроки и требования программ могут меняться по решению миграционных ведомств. Информация на сайте актуальна на дату публикации и не является юридической консультацией.',
  copyright: '© TOLK GLOBAL LTD',
  legalLinks: LANDING2_LEGAL_PAGES.map((page) => ({ label: page.footerLabel, href: page.path })),
};

/* ── Квиз ───────────────────────────────────────────────────────────── */

/**
 * Подписи квиза — плоские именованные поля, а не список: набор значений
 * ответов (`value` ниже) жёстко связан с `gradeQuiz()`, и редактируемый
 * список с удалением строк порвал бы эту связь. Тот же приём и по той же
 * причине, что у квиза лендинга-1 (`QUIZ_SCHEMA` в src/lib/quiz-admin.ts).
 */
export type Landing2QuizProps = {
  step1Question: string;
  step1Hint: string;
  step1OptionRemote: string;
  step1OptionBusiness: string;
  step1OptionFreelance: string;
  step1OptionOnline: string;
  step1OptionNone: string;

  step2Question: string;
  step2Hint: string;
  step2OptionSalary: string;
  step2OptionBusiness: string;
  step2OptionClients: string;
  step2OptionPassive: string;
  step2OptionNone: string;

  step3Question: string;
  step3Hint: string;
  step3OptionLt1500: string;
  step3OptionI1500: string;
  step3OptionI2500: string;
  step3OptionI4000: string;
  step3OptionI7000: string;

  step4Question: string;
  step4Hint: string;
  step4OptionLt3: string;
  step4OptionM36: string;
  step4OptionM612: string;
  step4OptionGt12: string;
  step4OptionIrregular: string;
  step4OptionPlanned: string;

  step5Question: string;
  step5Hint: string;
  step5OptionDe: string;
  step5OptionEs: string;
  step5OptionPt: string;
  step5OptionFr: string;
  step5OptionIt: string;
  step5OptionRs: string;
  step5OptionIdk: string;

  step6Question: string;
  step6Hint: string;
  step6OptionSolo: string;
  step6OptionFamily: string;

  resultATitle: string;
  resultALead: string;
  resultBTitle: string;
  resultBLead: string;
  resultCTitle: string;
  resultCLead: string;

  progressResultLabel: string;
  progressContactsLabel: string;
  progressDoneLabel: string;
  closeLabel: string;
  nextLabel: string;
  backLabel: string;
  restartLabel: string;
  bookLabel: string;
  guidesLabel: string;
  guidesHref: string;

  nameTitle: string;
  namePlaceholder: string;
  phoneTitle: string;
  phoneHint: string;
  phonePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
  errorNote: string;
  /**
   * Два согласия — отдельными галочками, не одной строкой «нажимая
   * кнопку, вы соглашаетесь». Так требует грузинский закон о защите
   * персональных данных: согласие даётся ПОСЛЕ информирования и, если
   * оно соседствует с другими положениями, должно быть ясно выделено;
   * передача данных в страну без признанных гарантий (CRM Bitrix24 в
   * РФ) — отдельное основание и отдельная галочка, а не часть общей.
   * Отметка каждой уходит в CRM вместе с текстом и временем — см.
   * LeadConsent в src/lib/lead-envelope.ts.
   *
   * Рядом с галочкой — короткая строка (`…Label`), полный текст
   * открывается попапом по клику на её часть (`…LinkText` — та подстрока
   * строки-подписи, которая становится ссылкой; если её в подписи нет,
   * ссылка просто добавляется следом).
   */
  consentDataLabel: string;
  consentDataLinkText: string;
  consentDataTitle: string;
  consentDataText: string;
  consentTransferLabel: string;
  consentTransferLinkText: string;
  consentTransferTitle: string;
  /**
   * Текста согласия на передачу здесь НЕТ: попап показывает страницу
   * «Согласие на обработку персональных данных» (`/legal/personal-data-consent`,
   * секция CMS `consent`) — документ под галочкой и документ на странице
   * обязаны совпадать дословно, поэтому источник один.
   */
  /** Версия формулировок — уходит в конверт заявки. Менять при ЛЮБОЙ
   *  правке текстов выше, иначе в CRM две разные редакции согласия
   *  будут помечены одинаково. */
  consentVersion: string;
  /** Строка про добровольность и отзыв — под галочками. */
  consentRevokeNote: string;
  /** Ссылки на юридические страницы под галочками. Пустая подпись —
   *  ссылка не показывается (например, если страницу убрали). */
  consentPrivacyLabel: string;
  consentPrivacyHref: string;
  consentConsentLabel: string;
  consentConsentHref: string;

  thanksTitle: string;
  thanksTelegramLabel: string;
  thanksTelegramHref: string;
  thanksBackLabel: string;
};

export const L2_QUIZ_DEFAULTS: Landing2QuizProps = {
  step1Question: 'Чем вы сейчас занимаетесь?',
  step1Hint: 'Можно выбрать несколько вариантов.',
  step1OptionRemote: 'Работаю удалённо по найму',
  step1OptionBusiness: 'Веду собственный бизнес',
  step1OptionFreelance: 'Работаю как фрилансер',
  step1OptionOnline: 'Развиваю собственный онлайн-проект',
  step1OptionNone: 'Нет стабильной удалённой деятельности',

  step2Question: 'Откуда вы получаете основной доход?',
  step2Hint: 'Можно выбрать несколько вариантов.',
  step2OptionSalary: 'Зарплата',
  step2OptionBusiness: 'Доход от собственного бизнеса',
  step2OptionClients: 'Оплаты от клиента (клиентов)',
  step2OptionPassive: 'Пассивный доход (аренда, дивиденды)',
  step2OptionNone: 'Пока нет стабильного дохода',

  step3Question: 'Какой у вас средний подтверждаемый доход в месяц?',
  step3Hint: 'Достаточно порядка цифр — точные суммы разбираем на консультации.',
  step3OptionLt1500: 'Менее 1 500 евро',
  step3OptionI1500: '1 500 – 2 500 евро',
  step3OptionI2500: '2 500 – 4 000 евро',
  step3OptionI4000: '4 000 – 7 000 евро',
  step3OptionI7000: 'Более 7 000 евро',

  step4Question: 'Как долго вы получаете этот доход?',
  step4Hint: 'Программы смотрят не только на сумму, но и на историю дохода.',
  step4OptionLt3: 'Менее 3 месяцев',
  step4OptionM36: 'От 3 до 6 месяцев',
  step4OptionM612: 'От 6 до 12 месяцев',
  step4OptionGt12: 'Более 12 месяцев',
  step4OptionIrregular: 'Доход нерегулярный',
  step4OptionPlanned: 'Деятельность только планируется',

  step5Question: 'Какие страны вы рассматриваете?',
  step5Hint: 'Можно выбрать несколько вариантов.',
  step5OptionDe: 'Германия',
  step5OptionEs: 'Испания',
  step5OptionPt: 'Португалия',
  step5OptionFr: 'Франция',
  step5OptionIt: 'Италия',
  step5OptionRs: 'Сербия',
  step5OptionIdk: 'Пока не определился',

  step6Question: 'Кто планирует переезд?',
  step6Hint: 'Состав влияет на требования к доходу и жилью.',
  step6OptionSolo: 'Только я',
  step6OptionFamily: 'Я и семья',

  resultATitle:
    'По предварительной оценке у вас есть основания рассматривать один или несколько маршрутов переезда в Европу.',
  resultALead:
    'Это предварительная оценка, а не юридическое заключение. Следующий шаг — обсудить детали на персональном разборе кейса.',
  resultBTitle: 'Ваш кейс требует индивидуальной проверки специалистом.',
  resultBLead:
    'По вашим ответам есть факторы, которые нужно сопоставить с требованиями программ вручную — это не значит, что подходящего маршрута нет.',
  resultCTitle:
    'По предварительной оценке сейчас мы не видим подходящего маршрута среди текущих программ.',
  resultCLead:
    'Это не юридический отказ. В части случаев ситуация меняется после накопления истории дохода или изменения структуры деятельности.',

  progressResultLabel: 'Результат',
  progressContactsLabel: 'Контакты',
  progressDoneLabel: 'Готово',
  closeLabel: 'Закрыть',
  nextLabel: 'Далее →',
  backLabel: 'Назад',
  restartLabel: 'Пройти заново',
  bookLabel: 'Записаться на персональный разбор кейса',
  guidesLabel: 'Посмотреть гайды',
  guidesHref: '#guides',

  nameTitle: 'Напишите, пожалуйста, ваше имя и фамилию',
  namePlaceholder: 'Имя и фамилия',
  phoneTitle: 'Спасибо! Теперь укажите номер телефона',
  phoneHint: 'Можно в любом формате — с кодом страны, через пробелы или без.',
  phonePlaceholder: '+49 …',
  submitLabel: 'Отправить',
  sendingLabel: 'Отправляем…',
  errorNote:
    'Не получилось отправить контакты — проверьте соединение и попробуйте ещё раз или напишите специалисту в Telegram.',
  consentDataLabel: 'Даю согласие на обработку персональных данных',
  consentDataLinkText: 'согласие на обработку персональных данных',
  consentDataTitle: 'Согласие на обработку персональных данных',
  // Пустая строка между абзацами — так же, как в любом textarea CMS:
  // рендер разбивает текст по ней (Landing2Quiz.tsx).
  consentDataText:
    'Я даю TOLK GLOBAL LTD согласие на обработку персональных данных, указанных мной в форме, для анализа моей ситуации, подбора возможных программ резидентства, связи со мной и организации консультации. Я ознакомился(-ась) с Политикой конфиденциальности.',
  consentTransferLabel: 'Даю согласие на передачу персональных данных в Российскую Федерацию',
  consentTransferLinkText: 'согласие на передачу персональных данных в Российскую Федерацию',
  consentTransferTitle: 'Согласие на передачу персональных данных в Российскую Федерацию',
  consentVersion: '2026-09-29',
  consentRevokeNote:
    'Согласие является добровольным и может быть отозвано путём направления сообщения на mail@tolk.global',
  consentPrivacyLabel: 'Политика конфиденциальности',
  consentPrivacyHref: legalPagePath('privacy'),
  // Ссылки на страницу согласия здесь по умолчанию нет: тот же документ
  // открывается попапом прямо с галочки, а вторая ссылка на него рядом
  // только загромождает строку. Поля остались — редактор может вернуть.
  consentConsentLabel: '',
  consentConsentHref: legalPagePath('consent'),

  thanksTitle: 'Спасибо! Мы получили ваши контакты, скоро с вами свяжется наш специалист.',
  thanksTelegramLabel: 'Написать в Telegram сейчас',
  thanksTelegramHref: TELEGRAM_MANAGER_URL,
  thanksBackLabel: 'Вернуться на сайт',
};

/** Ключ поля подписи — только те поля `Landing2QuizProps`, что являются строками-подписями. */
type QuizTextKey = keyof Landing2QuizProps;

export interface Landing2QuizOption {
  /** Значение ответа — участвует в gradeQuiz(), не редактируется. */
  value: string;
  /** Откуда берётся подпись варианта. */
  labelKey: QuizTextKey;
  /** Как поле называется в форме CMS. */
  adminLabel: string;
}

export interface Landing2QuizStep {
  /** id ответа в state квиза — участвует в gradeQuiz(). */
  id: 'activity' | 'source' | 'income' | 'stability' | 'countries' | 'who';
  /** Вопрос для конверта лида (человекочитаемое имя поля в CRM). */
  crmLabel: string;
  multi: boolean;
  questionKey: QuizTextKey;
  hintKey: QuizTextKey;
  options: Landing2QuizOption[];
}

/**
 * Единственное описание структуры квиза: и `Landing2Quiz.tsx` (рендер и
 * подсчёт), и `src/lib/landing2-sections.ts` (генерация схемы полей CMS)
 * читают его, чтобы 30 подписей вариантов не пришлось перечислять дважды.
 */
export const LANDING2_QUIZ_STEPS: readonly Landing2QuizStep[] = [
  {
    id: 'activity',
    crmLabel: 'Чем занимается',
    multi: true,
    questionKey: 'step1Question',
    hintKey: 'step1Hint',
    options: [
      { value: 'remote', labelKey: 'step1OptionRemote', adminLabel: 'вариант «удалённо по найму»' },
      {
        value: 'business',
        labelKey: 'step1OptionBusiness',
        adminLabel: 'вариант «собственный бизнес»',
      },
      { value: 'freelance', labelKey: 'step1OptionFreelance', adminLabel: 'вариант «фрилансер»' },
      { value: 'online', labelKey: 'step1OptionOnline', adminLabel: 'вариант «онлайн-проект»' },
      { value: 'none', labelKey: 'step1OptionNone', adminLabel: 'вариант «нет деятельности»' },
    ],
  },
  {
    id: 'source',
    crmLabel: 'Источник дохода',
    multi: true,
    questionKey: 'step2Question',
    hintKey: 'step2Hint',
    options: [
      { value: 'salary', labelKey: 'step2OptionSalary', adminLabel: 'вариант «зарплата»' },
      {
        value: 'business',
        labelKey: 'step2OptionBusiness',
        adminLabel: 'вариант «доход от бизнеса»',
      },
      {
        value: 'clients',
        labelKey: 'step2OptionClients',
        adminLabel: 'вариант «оплаты от клиентов»',
      },
      { value: 'passive', labelKey: 'step2OptionPassive', adminLabel: 'вариант «пассивный доход»' },
      { value: 'none', labelKey: 'step2OptionNone', adminLabel: 'вариант «нет дохода»' },
    ],
  },
  {
    id: 'income',
    crmLabel: 'Доход в месяц',
    multi: false,
    questionKey: 'step3Question',
    hintKey: 'step3Hint',
    options: [
      { value: 'lt1500', labelKey: 'step3OptionLt1500', adminLabel: 'вариант «менее 1500 €»' },
      { value: 'i1500', labelKey: 'step3OptionI1500', adminLabel: 'вариант «1500–2500 €»' },
      { value: 'i2500', labelKey: 'step3OptionI2500', adminLabel: 'вариант «2500–4000 €»' },
      { value: 'i4000', labelKey: 'step3OptionI4000', adminLabel: 'вариант «4000–7000 €»' },
      { value: 'i7000', labelKey: 'step3OptionI7000', adminLabel: 'вариант «более 7000 €»' },
    ],
  },
  {
    id: 'stability',
    crmLabel: 'История дохода',
    multi: false,
    questionKey: 'step4Question',
    hintKey: 'step4Hint',
    options: [
      { value: 'lt3', labelKey: 'step4OptionLt3', adminLabel: 'вариант «менее 3 месяцев»' },
      { value: 'm3_6', labelKey: 'step4OptionM36', adminLabel: 'вариант «3–6 месяцев»' },
      { value: 'm6_12', labelKey: 'step4OptionM612', adminLabel: 'вариант «6–12 месяцев»' },
      { value: 'gt12', labelKey: 'step4OptionGt12', adminLabel: 'вариант «более 12 месяцев»' },
      {
        value: 'irregular',
        labelKey: 'step4OptionIrregular',
        adminLabel: 'вариант «доход нерегулярный»',
      },
      {
        value: 'planned',
        labelKey: 'step4OptionPlanned',
        adminLabel: 'вариант «только планируется»',
      },
    ],
  },
  {
    id: 'countries',
    crmLabel: 'Интересующие страны',
    multi: true,
    questionKey: 'step5Question',
    hintKey: 'step5Hint',
    options: [
      { value: 'de', labelKey: 'step5OptionDe', adminLabel: 'вариант «Германия»' },
      { value: 'es', labelKey: 'step5OptionEs', adminLabel: 'вариант «Испания»' },
      { value: 'pt', labelKey: 'step5OptionPt', adminLabel: 'вариант «Португалия»' },
      { value: 'fr', labelKey: 'step5OptionFr', adminLabel: 'вариант «Франция»' },
      { value: 'it', labelKey: 'step5OptionIt', adminLabel: 'вариант «Италия»' },
      { value: 'rs', labelKey: 'step5OptionRs', adminLabel: 'вариант «Сербия»' },
      { value: 'idk', labelKey: 'step5OptionIdk', adminLabel: 'вариант «не определился»' },
    ],
  },
  {
    id: 'who',
    crmLabel: 'Кто переезжает',
    multi: false,
    questionKey: 'step6Question',
    hintKey: 'step6Hint',
    options: [
      { value: 'solo', labelKey: 'step6OptionSolo', adminLabel: 'вариант «только я»' },
      { value: 'family', labelKey: 'step6OptionFamily', adminLabel: 'вариант «я и семья»' },
    ],
  },
] as const;
