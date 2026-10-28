import { L2_HOW_DEFAULTS, type Landing2HowProps } from '../content';

export type HowItWorksProps = Partial<Landing2HowProps>;

export function HowItWorks({
  title = L2_HOW_DEFAULTS.title,
  steps = L2_HOW_DEFAULTS.steps,
}: HowItWorksProps) {
  return (
    <section id="how" className="l2-how">
      <div className="l2-how-inner">
        <h2 className="l2-h2 l2-how-title">{title}</h2>
        <div className="l2-how-steps">
          {/* Сквозная пунктирная линия маршрута — декор, вне потока шагов. */}
          <div className="l2-how-route" aria-hidden="true" />
          {steps.map((step, index) => (
            <div className="l2-how-step" key={`${step.title}-${index}`}>
              <div className="l2-how-num">{index + 1}</div>
              <div className="l2-how-body">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
