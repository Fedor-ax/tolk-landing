import { L2_WHY_DEFAULTS, type Landing2WhyProps } from '../content';

export type WhyTolkProps = Partial<Landing2WhyProps>;

export function WhyTolk({
  title = L2_WHY_DEFAULTS.title,
  stats = L2_WHY_DEFAULTS.stats,
  refundText = L2_WHY_DEFAULTS.refundText,
}: WhyTolkProps) {
  return (
    <section className="l2-dark">
      <div className="l2-why-inner">
        <h2 className="l2-h2">{title}</h2>
        <div className="l2-why-stats">
          {stats.map((stat, index) => (
            <div key={`${stat.value}-${index}`}>
              <div className="l2-why-value">{stat.value}</div>
              <div className="l2-why-label">{stat.label}</div>
              <p className="l2-why-note">{stat.description}</p>
            </div>
          ))}
        </div>
        <div className="l2-why-refund">
          <img src="/landing-2/tolk-excl.png" alt="" loading="lazy" />
          <p>{refundText}</p>
        </div>
      </div>
    </section>
  );
}
