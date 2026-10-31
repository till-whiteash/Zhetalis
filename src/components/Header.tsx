import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import type { SectionId } from '@/data/sections';
import type { LenisRef } from '@/lib/scrollTo';
import { useSectionNav, contactPath } from '@/lib/useSectionNav';
import logoMark from '@/assets/logo-mark.png';
import logoWord from '@/assets/logo-word.png';
import LangPicker from './LangPicker';
import { MenuIcon } from './icons';

interface Props {
  /** null when not on the home page */
  active: SectionId | null;
  lenisRef: LenisRef;
}

const NAV_ITEMS = [
  { to: '/services', key: 'nav.services' },
  { to: '/packages', key: 'nav.packages' },
  { to: '/work',     key: 'nav.work' },
  { to: '/about',    key: 'nav.about' },
] as const;

export default function Header({ lenisRef }: Props) {
  const { t } = useI18n();
  const { go: goSection, href } = useSectionNav(lenisRef);
  const { pathname } = useLocation();
  const onContact = pathname === '/contact';
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e: React.MouseEvent, id: SectionId | 'top') => {
    setOpen(false);
    goSection(e, id);
  };

  return (
    <header className={`site-header${solid || open ? ' solid' : ''}`}>
      <div className="wrap nav">
        <a className="brand" href={href('top')} aria-label="Zhetalis" onClick={(e) => go(e, 'top')}>
          <img src={logoMark} width={50} height={39} alt="" />
          <img src={logoWord} width={126} height={20} alt="Zhetalis" />
        </a>

        <nav
          className="nav-links"
          data-open={open ? 'true' : 'false'}
          aria-label="Main"
        >
          {NAV_ITEMS.map((item) => {
            const here = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={here ? 'active' : undefined}
                aria-current={here ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            );
          })}
          <Link
            className="btn btn-gold"
            to={contactPath()}
            aria-current={onContact ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {t('nav.book')}
          </Link>
        </nav>

        <div className="nav-tools">
          <LangPicker />
          <button
            className="menu-btn"
            aria-expanded={open}
            aria-controls="navLinks"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
