'use client';

import { useEffect, useRef, useState } from 'react';
import { landing2RootClassName } from './fonts';
import './landing2.css';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { NotVisaCenter } from './sections/NotVisaCenter';
import { HowItWorks } from './sections/HowItWorks';
import { Countries } from './sections/Countries';
import { WhyTolk } from './sections/WhyTolk';
import { Cases } from './sections/Cases';
import { MiniCta } from './sections/MiniCta';
import { Faq } from './sections/Faq';
import { FinalCta } from './sections/FinalCta';
import { Footer } from './sections/Footer';
import { Landing2Quiz } from './Landing2Quiz';
import { LANDING2_LEGAL_PAGES, SECTION_ANCHORS } from './content';
import type {
  Landing2CasesProps,
  Landing2CountriesProps,
  Landing2FaqProps,
  Landing2FinalCtaProps,
  Landing2FooterProps,
  Landing2HeaderProps,
  Landing2HeroProps,
  Landing2HowProps,
  Landing2MiniCtaProps,
  Landing2NotVisaProps,
  Landing2QuizProps,
  Landing2WhyProps,
} from './content';

/**
 * Секции лендинга: объект по ключу секции (`src/data/sections.json`),
 * `null` — показываются дефолты хендоффа из content.ts. Пустые значения
 * отбрасываются ещё при загрузке (`src/data/sections.ts`), поэтому здесь
 * можно просто спредить.
 */
export type Landing2Sections = Record<string, Record<string, unknown> | null>;

export interface Landing2PageProps {
  sections: Landing2Sections;
}

export function Landing2Page({ sections }: Landing2PageProps) {
  const [quizOpen, setQuizOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  // `/?quiz=open` (ссылки из рассылок и кнопка в шапке юридических
  // страниц) сразу открывает тест. Страница статическая, параметры
  // запроса на сборке неизвестны — читаем их в браузере.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('quiz') === 'open') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- разовая синхронизация с URL после гидратации
      setQuizOpen(true);
    }
  }, []);

  function openQuiz() {
    // Куда вернуть фокус после закрытия оверлея — та кнопка, с которой
    // квиз открыли (их на странице четыре).
    triggerRef.current = document.activeElement as HTMLElement | null;
    setQuizOpen(true);
  }

  function closeQuiz() {
    setQuizOpen(false);
    triggerRef.current?.focus();
  }

  const part = <T,>(key: string) => (sections[key] ?? {}) as Partial<T>;

  /**
   * Выключатель секции из CMS (`visible`, см. landing2-sections.ts).
   * Именно `!== false`, а не проверка на истинность: у секции, которую
   * ни разу не сохраняли, строки в БД нет вовсе и поля тоже — она
   * должна показываться, а не пропадать.
   */
  const isVisible = (key: string) => sections[key]?.['visible'] !== false;

  // Ссылка в меню на выключенную секцию вела бы в никуда — такие якоря
  // шапка выкидывает из своей навигации.
  const hiddenAnchors = Object.entries(SECTION_ANCHORS)
    .filter(([, sectionKey]) => !isVisible(sectionKey))
    .map(([anchor]) => anchor);

  // То же самое для нижней строки подвала: выключенная в CMS
  // юридическая страница отдаёт 404, ссылка на неё не нужна.
  const hiddenLegalPaths = LANDING2_LEGAL_PAGES.filter((page) => !isVisible(page.key)).map(
    (page) => page.path,
  );

  return (
    <div className={landing2RootClassName}>
      {isVisible('header') && (
        <Header
          {...part<Landing2HeaderProps>('header')}
          hiddenAnchors={hiddenAnchors}
          onQuizOpen={openQuiz}
        />
      )}
      <main className="l2-main">
        {isVisible('hero') && <Hero {...part<Landing2HeroProps>('hero')} onQuizOpen={openQuiz} />}
        {isVisible('notVisa') && <NotVisaCenter {...part<Landing2NotVisaProps>('notVisa')} />}
        {isVisible('how') && <HowItWorks {...part<Landing2HowProps>('how')} />}
        {isVisible('countries') && (
          <Countries {...part<Landing2CountriesProps>('countries')} onQuizOpen={openQuiz} />
        )}
        {isVisible('why') && <WhyTolk {...part<Landing2WhyProps>('why')} />}
        {isVisible('cases') && <Cases {...part<Landing2CasesProps>('cases')} />}
        {isVisible('miniCta') && (
          <MiniCta {...part<Landing2MiniCtaProps>('miniCta')} onQuizOpen={openQuiz} />
        )}
        {isVisible('faq') && <Faq {...part<Landing2FaqProps>('faq')} />}
        {isVisible('finalCta') && (
          <FinalCta {...part<Landing2FinalCtaProps>('finalCta')} onQuizOpen={openQuiz} />
        )}
      </main>
      {isVisible('footer') && (
        <Footer {...part<Landing2FooterProps>('footer')} hiddenLegalPaths={hiddenLegalPaths} />
      )}
      {quizOpen && (
        <Landing2Quiz
          {...part<Landing2QuizProps>('quiz')}
          // Текст согласия на передачу данных — со страницы
          // `/legal/personal-data-consent`: попап у галочки и страница
          // обязаны показывать один и тот же документ. Очищен в CMS —
          // остаётся дефолт самого квиза (`L2_CONSENT_BODY`).
          transferConsentText={(sections['consent']?.['body'] as string | undefined) || undefined}
          onClose={closeQuiz}
        />
      )}
    </div>
  );
}

export default Landing2Page;
