import { useI18n } from '@/i18n/I18nProvider';
import { FAQS } from '@/data/faqs';
import { useInView } from '@/hooks/useInView';

export default function Faq() {
  const { t } = useI18n();
  const [headRef, headIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const [listRef, listIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });

  return (
    <section className="section" id="faq">
      <div className="wrap faq-wrap">
        <div ref={headRef} className={`head${headIn ? ' in' : ' armed'}`} style={{ marginBottom: 0 }}>
          <p className="label">{t('faq.label')}</p>
          <h2 className="h2">{t('faq.h2')}</h2>
        </div>
        <div ref={listRef} className={listIn ? 'in' : 'armed'}>
          {FAQS.map((f) => (
            <div className="qa" key={f.q}>
              <h3>{t(f.q)}</h3>
              <p>{t(f.a)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}