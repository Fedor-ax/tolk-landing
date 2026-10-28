import { L2_COUNTRIES_DEFAULTS, type Landing2CountriesProps } from '../content';

export interface CountriesProps extends Partial<Landing2CountriesProps> {
  onQuizOpen: () => void;
}

/**
 * Аккордеон направлений. В прототипе это JS-тогглы с состоянием `c[]`;
 * здесь — нативный `<details>`: те же независимые карточки, закрытые по
 * умолчанию, но работают и без JS, а знак `+`/`−` рисует CSS
 * (`.l2-country-sign::after`, см. landing2.css).
 */
export function Countries({
  title = L2_COUNTRIES_DEFAULTS.title,
  intro = L2_COUNTRIES_DEFAULTS.intro,
  items = L2_COUNTRIES_DEFAULTS.items,
  ctaLead = L2_COUNTRIES_DEFAULTS.ctaLead,
  ctaText = L2_COUNTRIES_DEFAULTS.ctaText,
  ctaButton = L2_COUNTRIES_DEFAULTS.ctaButton,
  onQuizOpen,
}: CountriesProps) {
  return (
    <section id="countries">
      <div className="l2-countries-inner">
        <h2 className="l2-h2">{title}</h2>
        <p className="l2-countries-intro">{intro}</p>
        <div className="l2-countries-list">
          {items.map((item, index) => (
            <details className="l2-country" key={`${item.country}-${item.program}-${index}`}>
              <summary className="l2-country-head">
                <span className="l2-country-place">{item.country}</span>
                <span className="l2-country-program">{item.program}</span>
                <span className="l2-country-sign" aria-hidden="true" />
              </summary>
              <div className="l2-country-body">
                <p>{item.description}</p>
                {item.fact && <p className="l2-country-fact">{item.fact}</p>}
              </div>
            </details>
          ))}
        </div>
        <div className="l2-countries-cta">
          <p>
            <strong>{ctaLead}</strong> {ctaText}
          </p>
          <button type="button" className="l2-btn l2-btn--md" onClick={onQuizOpen}>
            {ctaButton}
          </button>
        </div>
      </div>
    </section>
  );
}
