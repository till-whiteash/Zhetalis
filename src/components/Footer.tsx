import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import { CHAPTERS } from '@/data/chapters';
import type { LenisRef } from '@/lib/scrollTo';
import { useSectionNav, contactPath } from '@/lib/useSectionNav';
import logoMark from '@/assets/logo-mark.png';
import logoWord from '@/assets/logo-word.png';

interface Props {
  lenisRef: LenisRef;
}

export default function Footer({ lenisRef }: Props) {
  const { t } = useI18n();
  const { go, href } = useSectionNav(lenisRef);

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
            href={href('top')}
            aria-label="Zhetalis"
            onClick={(e) => go(e, 'top')}
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
              <a key={c.id} href={href(c.id)} onClick={(e) => go(e, c.id)}>
                {t(c.labelKey)}
              </a>
            ))}
          </div>
          <div>
            <p className="label">{t('ft.company')}</p>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/work">{t('nav.work')}</Link>
            <a href={href('approach')} onClick={(e) => go(e, 'approach')}>{t('nav.approach')}</a>
            <a href={href('packages')} onClick={(e) => go(e, 'packages')}>{t('nav.packages')}</a>
            <a href={href('faq')} onClick={(e) => go(e, 'faq')}>{t('nav.faq')}</a>
          </div>
          <div>
            <p className="label">{t('ft.contact')}</p>
            <Link to={contactPath()}>{t('cta.btn')}</Link>
            <span>{t('off.sgHQ')}</span>
            <span>{t('off.tw')}</span>
            <span className="ltr">{SITE.phone}</span>
            <span className="ltr">{SITE.phoneTW}</span>
            {SITE.email && <a className="ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a>}
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
          onClick={(e) => {
            e.preventDefault();
            const lenis = lenisRef.current;
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
          {t('ft.top')}
        </a>
      </div>
    </footer>
  );
}