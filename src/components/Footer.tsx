import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import { CHAPTERS } from '@/data/chapters';
import { scrollToId, type LenisRef } from '@/lib/scrollTo';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import logoMark from '@/assets/logo-mark.png';
import logoWord from '@/assets/logo-word.png';

interface Props {
  lenisRef: LenisRef;
}

export default function Footer({ lenisRef }: Props) {
  const { t } = useI18n();
  const reduce = useReducedMotion();

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;
  const lineHref = SITE.line
    ? SITE.line.startsWith('@')
      ? `https://line.me/R/ti/p/%40${encodeURIComponent(SITE.line.slice(1))}`
      : `https://line.me/ti/p/~${encodeURIComponent(SITE.line)}`
    : '#';

  return (
    <footer className="footer">
      <div className="wrap foot-top">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            className="brand"
            href="#top"
            aria-label="Zhetalis"
            onClick={(e) => { e.preventDefault(); scrollToId('top', lenisRef, reduce); }}
          >
            <img src={logoMark} width={40} height={31} alt="" />
            <img src={logoWord} width={110} height={18} alt="Zhetalis" />
          </a>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>{t('ft.tag')}</p>
        </div>

        <nav className="foot-cols" aria-label="Footer">
          <div>
            <p className="label">{t('ft.services')}</p>
            {CHAPTERS.map((c) => (
              <a key={c.id} href={`#${c.id}`}
                onClick={(e) => { e.preventDefault(); scrollToId(c.id, lenisRef, reduce); }}>
                {t(c.labelKey)}
              </a>
            ))}
          </div>
          <div>
            <p className="label">{t('ft.company')}</p>
            <a href="#approach" onClick={(e) => { e.preventDefault(); scrollToId('approach', lenisRef, reduce); }}>{t('nav.approach')}</a>
            <a href="#packages" onClick={(e) => { e.preventDefault(); scrollToId('packages', lenisRef, reduce); }}>{t('nav.packages')}</a>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollToId('faq', lenisRef, reduce); }}>{t('nav.faq')}</a>
          </div>
          <div>
            <p className="label">{t('ft.contact')}</p>
            <span>{t('off.sgHQ')}</span>
            <span>{t('off.tw')}</span>
            <span className="ltr">{SITE.phone}</span>
            <span className="ltr">{SITE.phoneTW}</span>
            {SITE.email && <span className="ltr">{SITE.email}</span>}
            <a href={waHref} target="_blank" rel="noopener">WhatsApp</a>
            {SITE.line && <a href={lineHref} target="_blank" rel="noopener">LINE</a>}
          </div>
        </nav>
      </div>

      <div className="mega" aria-hidden="true">
        {['Z', 'H', 'E', 'T', 'A', 'L', 'I', 'S'].map((ch) => <span key={ch}>{ch}</span>)}
      </div>

      <div className="wrap foot-bottom">
        <span>{t('ft.rights')}</span>
        <a href="#top" style={{ color: 'var(--muted)' }}
          onClick={(e) => { e.preventDefault(); scrollToId('top', lenisRef, reduce); }}>
          {t('ft.top')}
        </a>
      </div>
    </footer>
  );
}