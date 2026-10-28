import { L2_FINAL_CTA_DEFAULTS, type Landing2FinalCtaProps } from '../content';

export interface FinalCtaProps extends Partial<Landing2FinalCtaProps> {
  onQuizOpen: () => void;
}

export function FinalCta({
  title = L2_FINAL_CTA_DEFAULTS.title,
  text = L2_FINAL_CTA_DEFAULTS.text,
  quizButtonText = L2_FINAL_CTA_DEFAULTS.quizButtonText,
  telegramText = L2_FINAL_CTA_DEFAULTS.telegramText,
  telegramHref = L2_FINAL_CTA_DEFAULTS.telegramHref,
  onQuizOpen,
}: FinalCtaProps) {
  return (
    <section className="l2-dark l2-final">
      <img className="l2-final-mark" src="/landing-2/tolk-mark.png" alt="" loading="lazy" />
      <div className="l2-final-inner">
        <h2 className="l2-final-title">{title}</h2>
        <p className="l2-final-text">{text}</p>
        <div className="l2-final-actions">
          <button type="button" className="l2-btn" onClick={onQuizOpen}>
            {quizButtonText}
          </button>
          <a className="l2-btn-ghost" href={telegramHref} target="_blank" rel="noopener">
            {telegramText}
          </a>
        </div>
      </div>
    </section>
  );
}
