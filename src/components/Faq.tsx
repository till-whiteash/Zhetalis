import { useId, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { FAQS } from '@/data/faqs';
import { useInView } from '@/hooks/useInView';

export default function Faq() {
  const { t } = useI18n();
  const id = useId();
  const [open, setOpen] = useState<number[]>([]);
  const [headRef, headIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const [listRef, listIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });

  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((n) => n !== i) : [...o, i]));

  return (
    <section className="section" id="faq">
      <div className="wrap faq-wrap">
        <div ref={headRef} className={`head${headIn ? ' in' : ' armed'}`} style={{ marginBottom: 0 }}>
          <p className="label">{t('faq.label')}</p>
          <h2 className="h2">{t('faq.h2')}</h2>
        </div>
        <div ref={listRef} className={listIn ? 'in' : 'armed'}>
          {FAQS.map((f, i) => {
            const isOpen = open.includes(i);
            return (
              <div className={`qa${isOpen ? ' open' : ''}`} key={f.q}>
                <h3>
                  <button
                    type="button"
                    className="qa-q"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span>{t(f.q)}</span>
                    <span className="pm" aria-hidden="true" />
                  </button>
                </h3>
                <div className="qa-a" id={`${id}-${i}`} inert={!isOpen}>
                  <div><p>{t(f.a)}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
