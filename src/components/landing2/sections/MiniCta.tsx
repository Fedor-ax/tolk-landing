import { L2_MINI_CTA_DEFAULTS, type Landing2MiniCtaProps } from '../content';

export interface MiniCtaProps extends Partial<Landing2MiniCtaProps> {
  onQuizOpen: () => void;
}

export function MiniCta({
  title = L2_MINI_CTA_DEFAULTS.title,
  text = L2_MINI_CTA_DEFAULTS.text,
  buttonText = L2_MINI_CTA_DEFAULTS.buttonText,
  onQuizOpen,
}: MiniCtaProps) {
  return (
    <section className="l2-minicta">
      <div className="l2-minicta-inner">
        <div className="l2-dash-rule" aria-hidden="true" />
        <h3 className="l2-minicta-title">{title}</h3>
        <p className="l2-minicta-text">{text}</p>
        <button type="button" className="l2-btn" onClick={onQuizOpen}>
          {buttonText}
        </button>
      </div>
    </section>
  );
}
