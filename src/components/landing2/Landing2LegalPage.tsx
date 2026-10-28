import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { landing2RootClassName } from './fonts';
import './landing2.css';
import { Header } from './sections/Header';
import { Footer } from './sections/Footer';
import {
  LANDING2_LEGAL_PAGES,
  L2_LEGAL_DEFAULTS_BY_KEY,
  SECTION_ANCHORS,
  type Landing2FooterProps,
  type Landing2HeaderProps,
  type Landing2LegalKey,
  type Landing2LegalPageProps,
} from './content';
import type { Landing2Sections } from './Landing2Page';

/**
 * Юридическая страница лендинга-2 (`/legal`, `/legal/privacy-policy`,
 * `/legal/personal-data-consent`) — шапка и подвал те же, что на
 * лендинге, между ними текст документа из CMS.
 *
 * В отличие от `Landing2Page` это НЕ клиентский компонент: на странице
 * нет ни квиз-оверлея, ни другого состояния, поэтому JS ей не нужен
 * вовсе. Кнопка квиза в шапке здесь — обычная ссылка на `/?quiz=open`
 * (главная понимает этот параметр, см. `src/app/page.tsx`), пункты меню
 * ведут на якоря главной. Стили — тот же `landing2.css`: маршрут
 * импортирует то же дерево, отдельного чанка не появляется.
 */
export interface Landing2LegalPageViewProps {
  /** Все секции лендинга из CMS — нужны шапке и подвалу. */
  sections: Landing2Sections;
  legalKey: Landing2LegalKey;
}

export function Landing2LegalPage({ sections, legalKey }: Landing2LegalPageViewProps) {
  const part = <T,>(key: string) => (sections[key] ?? {}) as Partial<T>;
  // Та же семантика, что на лендинге: скрыто только явное `false`,
  // отсутствие поля означает «показывать» (секцию ни разу не сохраняли).
  const isVisible = (key: string) => sections[key]?.['visible'] !== false;

  const page: Landing2LegalPageProps = {
    ...L2_LEGAL_DEFAULTS_BY_KEY[legalKey],
    ...part<Landing2LegalPageProps>(legalKey),
  };

  const hiddenAnchors = Object.entries(SECTION_ANCHORS)
    .filter(([, sectionKey]) => !isVisible(sectionKey))
    .map(([anchor]) => anchor);
  const hiddenLegalPaths = LANDING2_LEGAL_PAGES.filter((item) => !isVisible(item.key)).map(
    (item) => item.path,
  );

  return (
    <div className={landing2RootClassName}>
      {isVisible('header') && (
        <Header
          {...part<Landing2HeaderProps>('header')}
          hiddenAnchors={hiddenAnchors}
          quizHref="/?quiz=open"
        />
      )}
      <main className="l2-main">
        <article className="l2-legal">
          <h1 className="l2-legal-title">{page.title}</h1>
          {page.body.trim() ? (
            <div className="l2-legal-body">
              {/* react-markdown, не dangerouslySetInnerHTML — тот же приём,
                  что у страниц лендинга-1 (`page-view.tsx`): текст из CMS
                  превращается в React-элементы, а не в сырой HTML.
                  remark-gfm — ради таблиц: реквизиты компании набираются
                  именно ими, а базовый CommonMark таблиц не знает и
                  выводит разметку как текст (поймано на скриншоте). */}
              <Markdown remarkPlugins={[remarkGfm]}>{page.body}</Markdown>
            </div>
          ) : (
            <p className="l2-legal-empty">Текст документа готовится.</p>
          )}
        </article>
      </main>
      {isVisible('footer') && (
        <Footer {...part<Landing2FooterProps>('footer')} hiddenLegalPaths={hiddenLegalPaths} />
      )}
    </div>
  );
}

export default Landing2LegalPage;
