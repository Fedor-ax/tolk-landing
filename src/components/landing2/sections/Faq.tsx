import { L2_FAQ_DEFAULTS, type Landing2FaqProps } from '../content';

export type FaqProps = Partial<Landing2FaqProps>;

/** Аккордеон FAQ — нативный `<details>`, см. комментарий в Countries.tsx. */
export function Faq({ title = L2_FAQ_DEFAULTS.title, items = L2_FAQ_DEFAULTS.items }: FaqProps) {
  return (
    <section id="faq">
      <div className="l2-faq-inner">
        <h2 className="l2-h2 l2-faq-title">{title}</h2>
        <div className="l2-faq-list">
          {items.map((item, index) => (
            <details className="l2-faq-item" key={`${item.question}-${index}`}>
              <summary className="l2-faq-head">
                <span className="l2-faq-question">{item.question}</span>
                <span className="l2-faq-sign" aria-hidden="true" />
              </summary>
              <p className="l2-faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
