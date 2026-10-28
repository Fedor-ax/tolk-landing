import { Landing2Logo } from '../Landing2Logo';
import { L2_FOOTER_DEFAULTS, type Landing2FooterIcon, type Landing2FooterProps } from '../content';

export interface FooterProps extends Partial<Landing2FooterProps> {
  /** Адреса юридических страниц, выключенных в CMS — такие ссылки из
   *  нижней строки не рендерятся (тот же приём, что `hiddenAnchors` у
   *  шапки: ссылка на выключенную страницу вела бы на 404). */
  hiddenLegalPaths?: string[];
}

/** Иконки подвала — инлайн, ровно из хендоффа (в проекте нет иконочной библиотеки). */
function FooterIcon({ icon }: { icon: Landing2FooterIcon }) {
  if (icon === 'instagram') {
    return (
      <svg
        className="l2-footer-icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg
      className="l2-footer-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.9 4.3 18.9 19c-.2 1-.8 1.3-1.6.8l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.4 8-7.2c.3-.3 0-.5-.5-.2L7.9 12.4 3.6 11c-.9-.3-.9-.9.2-1.3l17-6.5c.8-.3 1.4.2 1.1 1.1Z" />
    </svg>
  );
}

export function Footer({
  tagline = L2_FOOTER_DEFAULTS.tagline,
  links = L2_FOOTER_DEFAULTS.links,
  disclaimer = L2_FOOTER_DEFAULTS.disclaimer,
  copyright = L2_FOOTER_DEFAULTS.copyright,
  legalLinks = L2_FOOTER_DEFAULTS.legalLinks,
  hiddenLegalPaths = [],
}: FooterProps) {
  const visibleLegalLinks = legalLinks.filter((link) => !hiddenLegalPaths.includes(link.href));

  return (
    <footer className="l2-footer">
      <div className="l2-footer-inner">
        <div className="l2-footer-top">
          <div className="l2-footer-brand">
            <Landing2Logo width={112} />
            <div className="l2-footer-tagline">{tagline}</div>
          </div>
          <nav className="l2-footer-links" aria-label="Контакты и соцсети">
            {links.map((link) => (
              <a key={link.href + link.label} href={link.href} target="_blank" rel="noopener">
                <FooterIcon icon={link.icon} />
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
        <p className="l2-footer-disclaimer">{disclaimer}</p>
        {(copyright || visibleLegalLinks.length > 0) && (
          <div className="l2-footer-legal">
            {copyright && <span className="l2-footer-copyright">{copyright}</span>}
            {visibleLegalLinks.map((link, index) => (
              <span className="l2-footer-legal-item" key={link.href + link.label}>
                {/* Разделитель «·» — отдельным элементом, а не ::before
                    внутри ссылки: иначе точка красилась бы оранжевым
                    вместе со ссылкой на ховере. */}
                {(index > 0 || Boolean(copyright)) && (
                  <span className="l2-footer-dot" aria-hidden="true">
                    ·
                  </span>
                )}
                <a href={link.href}>{link.label}</a>
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
