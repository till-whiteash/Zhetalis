import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import { useInView } from '@/hooks/useInView';
import { contactPath } from '@/lib/useSectionNav';
import { ArrowIcon, WhatsAppIcon } from './icons';

const NEXT_STEPS = ['cp.n0', 'cp.n1', 'cp.n2'] as const;

/** Home-page call-to-action. The full enquiry lives on /contact (src/pages/Contact.tsx). */
export default function Contact() {
  const { t } = useI18n();
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;

  return (
    <section className="section contact" id="contact">
      <div ref={ref} className={`wrap contact-grid${inView ? '' : ' armed'}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <p className="label">{t('ct.label')}</p>
          <h2 className="h2">{t('ct.h2')}</h2>
          <p className="lede">{t('cta.lede')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link className="btn btn-ink" to={contactPath()}>
              <span>{t('cta.btn')}</span> <ArrowIcon className="ai" />
            </Link>
            <a className="btn btn-ink" href={waHref} target="_blank" rel="noopener">
              <WhatsAppIcon /> <span>{t('ct.wa')}</span>
            </a>
          </div>
        </div>

        <ol className="lines cta-steps">
          {NEXT_STEPS.map((k, i) => (
            <li className="line" key={k}>
              <span className="k">{String(i + 1).padStart(2, '0')}</span>
              <span className="v">{t(k)}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
