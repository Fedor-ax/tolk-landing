import { L2_NOT_VISA_DEFAULTS, type Landing2NotVisaProps } from '../content';

export type NotVisaCenterProps = Partial<Landing2NotVisaProps>;

export function NotVisaCenter({
  title = L2_NOT_VISA_DEFAULTS.title,
  paragraph = L2_NOT_VISA_DEFAULTS.paragraph,
  highlight = L2_NOT_VISA_DEFAULTS.highlight,
}: NotVisaCenterProps) {
  return (
    <section className="l2-notvisa">
      <div className="l2-notvisa-inner">
        <h2 className="l2-h2">{title}</h2>
        <div className="l2-notvisa-text">
          <p>{paragraph}</p>
          <p className="l2-notvisa-highlight">{highlight}</p>
        </div>
      </div>
    </section>
  );
}
