import { L2_CASES_DEFAULTS, type Landing2CasesProps } from '../content';

export type CasesProps = Partial<Landing2CasesProps>;

export function Cases({
  title = L2_CASES_DEFAULTS.title,
  notice = L2_CASES_DEFAULTS.notice,
  items = L2_CASES_DEFAULTS.items,
}: CasesProps) {
  return (
    <section id="cases">
      <div className="l2-cases-inner">
        <h2 className="l2-h2">{title}</h2>
        {notice && (
          <div className="l2-cases-notice">
            <img src="/landing-2/tolk-excl.png" alt="" loading="lazy" />
            <p>{notice}</p>
          </div>
        )}
        <div className="l2-cases-grid">
          {items.map((item, index) => (
            <article className="l2-case" key={`${item.program}-${index}`}>
              <div className="l2-case-program">{item.program}</div>
              <div className="l2-case-body">
                <img
                  className="l2-case-quote-mark"
                  src="/landing-2/tolk-quote.png"
                  alt=""
                  loading="lazy"
                />
                <p className="l2-case-quote">{item.quote}</p>
                <div className="l2-case-author">
                  {/* Фото выключено в CMS — не рендерим и рамку под него,
                      иначе в строке автора остался бы пустой серый квадрат.
                      `!== false`: у карточек, сохранённых до появления
                      этого переключателя, поля просто нет. */}
                  {item.photoVisible !== false && (
                    <div className="l2-case-avatar">
                      {item.photoSrc && (
                        <img
                          className="l2-photo"
                          src={item.photoSrc}
                          alt={item.name}
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}
                  <div className="l2-case-name">
                    {item.name}
                    <br />
                    <span>{item.caption}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
