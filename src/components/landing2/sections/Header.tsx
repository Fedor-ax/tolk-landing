import { Landing2Logo } from '../Landing2Logo';
import { L2_HEADER_DEFAULTS, type Landing2HeaderProps } from '../content';

export interface HeaderProps extends Partial<Landing2HeaderProps> {
  /** Якоря выключенных в CMS секций — такие пункты меню не рендерятся
   *  (см. SECTION_ANCHORS в content.ts). Фильтр здесь, а не в
   *  Landing2Page, чтобы дефолтный набор пунктов остался в компоненте,
   *  как у всех остальных секций. */
  hiddenAnchors?: string[];
  /** Открыть квиз-оверлей — на лендинге. На отдельных страницах
   *  (юридические, `/legal/*`) оверлея нет вовсе: там вместо колбэка
   *  передаётся `quizHref`, и кнопка становится обычной ссылкой. */
  onQuizOpen?: () => void;
  /**
   * Адрес кнопки квиза и база для якорей меню. Задан — шапка целиком
   * без JS: логотип и пункты ведут на главную (`/#how`), кнопка — на
   * `/?quiz=open` (этот параметр главная уже понимает, см. page.tsx).
   */
  quizHref?: string;
}

/** Sticky-шапка: логотип, оранжевая кнопка квиза и строка якорей. */
export function Header({
  ctaText = L2_HEADER_DEFAULTS.ctaText,
  nav = L2_HEADER_DEFAULTS.nav,
  hiddenAnchors = [],
  onQuizOpen,
  quizHref,
}: HeaderProps) {
  const visibleNav = nav.filter((item) => !hiddenAnchors.includes(item.anchor));
  // На отдельной странице якорь `#how` указывал бы в саму эту страницу,
  // где таких секций нет — ведём на главную.
  const anchorBase = quizHref ? '/' : '';
  const homeHref = quizHref ? '/' : '#top';

  return (
    <header className="l2-header">
      <div className="l2-header-top">
        <a href={homeHref} className="l2-header-logo">
          <Landing2Logo width={96} />
        </a>
        {quizHref ? (
          <a className="l2-btn l2-btn--sm l2-header-cta" href={quizHref}>
            {ctaText}
          </a>
        ) : (
          <button type="button" className="l2-btn l2-btn--sm l2-header-cta" onClick={onQuizOpen}>
            {ctaText}
          </button>
        )}
      </div>
      <nav className="l2-header-nav" aria-label="Разделы страницы">
        {visibleNav.map((item) => (
          <a key={item.anchor} href={`${anchorBase}${item.anchor}`}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
