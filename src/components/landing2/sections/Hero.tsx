import { L2_HERO_DEFAULTS, type Landing2HeroProps } from '../content';

export interface HeroProps extends Partial<Landing2HeroProps> {
  onQuizOpen: () => void;
}

export function Hero({
  badge = L2_HERO_DEFAULTS.badge,
  title = L2_HERO_DEFAULTS.title,
  subtitle = L2_HERO_DEFAULTS.subtitle,
  ctaText = L2_HERO_DEFAULTS.ctaText,
  secondaryText = L2_HERO_DEFAULTS.secondaryText,
  secondaryHref = L2_HERO_DEFAULTS.secondaryHref,
  trustExperience = L2_HERO_DEFAULTS.trustExperience,
  trustCountries = L2_HERO_DEFAULTS.trustCountries,
  photoSrc = L2_HERO_DEFAULTS.photoSrc,
  photoVisible = L2_HERO_DEFAULTS.photoVisible,
  photoAlt = L2_HERO_DEFAULTS.photoAlt,
  noteTitle = L2_HERO_DEFAULTS.noteTitle,
  noteText = L2_HERO_DEFAULTS.noteText,
  onQuizOpen,
}: HeroProps) {
  return (
    <section id="top" className="l2-hero">
      <div className="l2-hero-inner">
        <div className="l2-hero-col">
          <span className="l2-hero-badge">{badge}</span>
          <h1 className="l2-hero-title">{title}</h1>
          <p className="l2-hero-subtitle">{subtitle}</p>
          <div className="l2-hero-actions">
            <button type="button" className="l2-btn" onClick={onQuizOpen}>
              {ctaText}
            </button>
            <a className="l2-btn-link" href={secondaryHref} target="_blank" rel="noopener">
              {secondaryText}
            </a>
          </div>
          <div className="l2-hero-trust">
            <span>{trustExperience}</span>
            <span className="l2-hero-trust-dot">·</span>
            <span>{trustCountries}</span>
          </div>
        </div>
        {/* Фото выключено в CMS — арки нет вовсе, но карточка-ремарка
            остаётся: это текст, а не картинка. Без арки ей не от чего
            позиционироваться, поэтому модификатор возвращает её в поток
            (см. .l2-hero-media--no-photo в landing2.css). */}
        <div className={photoVisible ? 'l2-hero-media' : 'l2-hero-media l2-hero-media--no-photo'}>
          {photoVisible && (
            <div className="l2-hero-arch">
              {photoSrc ? (
                <img className="l2-photo" src={photoSrc} alt={photoAlt} loading="lazy" />
              ) : (
                <div className="l2-photo-placeholder">Фото: клиент / город Европы</div>
              )}
            </div>
          )}
          <div className="l2-hero-note">
            <div className="l2-hero-note-title">{noteTitle}</div>
            <div className="l2-hero-note-text">{noteText}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
