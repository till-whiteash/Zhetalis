import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import { useInView } from '@/hooks/useInView';
import EnquiryForm from './EnquiryForm';
import { CalendarIcon, WhatsAppIcon, LineIcon } from './icons';

interface Props {
  preselect: string | null;
}

export default function Contact({ preselect }: Props) {
  const { t } = useI18n();
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const [copied, setCopied] = useState<string | null>(null);

  const lineHref = SITE.line
    ? SITE.line.startsWith('@')
      ? `https://line.me/R/ti/p/%40${encodeURIComponent(SITE.line.slice(1))}`
      : `https://line.me/ti/p/~${encodeURIComponent(SITE.line)}`
    : '';

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
    } catch { /* ignore */ }
  };

  const copyLabel = (key: string) => (copied === key ? t('ct.copied') : t('ct.copy'));

  return (
    <section className="section contact" id="contact">
      <div className="wrap contact-grid">
        <div ref={ref} className={inView ? '' : 'armed'} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <p className="label">{t('ct.label')}</p>
          <h2 className="h2">{t('ct.h2')}</h2>
          <p className="lede">{t('ct.lede')}</p>

          <div className="lines">
            <div className="line">
              <span className="k">{t('off.hq')}</span>
              <span className="v">{t('off.sg')}</span>
            </div>
            <div className="line">
              <span className="k">{t('off.office')}</span>
              <span className="v">{t('off.tw')}</span>
            </div>
            <div className="line">
              <span className="k">{t('ct.hours')}</span>
              <span className="v">{t('ct.hoursVal')}</span>
            </div>
            <div className="line">
              <span className="k">{t('ct.phoneSG')}</span>
              <a className="v ltr" href={`tel:${SITE.phone.replace(/\s+/g, '')}`}>{SITE.phone}</a>
              <button className="copy" onClick={() => copy('phone', SITE.phone)}>{copyLabel('phone')}</button>
            </div>
            <div className="line">
              <span className="k">{t('ct.phoneTW')}</span>
              <a className="v ltr" href={`tel:${SITE.phoneTW.replace(/\s+/g, '')}`}>{SITE.phoneTW}</a>
              <button className="copy" onClick={() => copy('phoneTW', SITE.phoneTW)}>{copyLabel('phoneTW')}</button>
            </div>
            {SITE.email && (
              <div className="line">
                <span className="k">{t('ct.email')}</span>
                <a className="v ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a>
                <button className="copy" onClick={() => copy('email', SITE.email)}>{copyLabel('email')}</button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignSelf: 'flex-start' }}>
            {SITE.booking && (
              <a className="btn btn-ink" href={SITE.booking} target="_blank" rel="noopener">
                <CalendarIcon /> <span>{t('ct.book')}</span>
              </a>
            )}
            <a className="btn btn-ink" href={waHref} target="_blank" rel="noopener">
              <WhatsAppIcon /> <span>{t('ct.wa')}</span>
            </a>
            {lineHref ? (
              <a className="btn btn-ink" href={lineHref} target="_blank" rel="noopener">
                <LineIcon /> <span>{t('ct.line')}</span>
              </a>
            ) : (
              <button
                className="btn btn-ink"
                type="button"
                onClick={() => copy('lineNum', SITE.phoneTW)}
              >
                <LineIcon />
                <span>{copied === 'lineNum' ? t('ct.lineNum') : t('ct.line')}</span>
              </button>
            )}
          </div>
        </div>

        <EnquiryForm preselect={preselect} />
      </div>
    </section>
  );
}