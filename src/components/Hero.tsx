import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { parseRichWords } from '@/i18n/rich';
import { scrollToId, type LenisRef } from '@/lib/scrollTo';
import { contactPath } from '@/lib/useSectionNav';
import HeroCanvas from './HeroCanvas';
import { ArrowIcon } from './icons';

interface Props {
  lenisRef: LenisRef;
  reduce: boolean;
}

export default function Hero({ lenisRef, reduce }: Props) {
  const { t, lang } = useI18n();
  const innerRef = useRef<HTMLDivElement>(null);
  const headline = useMemo(
    () => parseRichWords(t('hero.h1'), lang.startsWith('zh')),
    [t, lang]
  );

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToId(id, lenisRef, reduce);
  };

  let headlineWordIndex = 0;
  const wordDelay = lang.startsWith('zh') ? 0.03 : 0.055;
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (reduce) {
      inner.style.removeProperty('transform');
      inner.style.removeProperty('opacity');
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const viewport = window.innerHeight;
      if (y < viewport * 1.2) {
        inner.style.transform = `translateY(${y * 0.22}px)`;
        inner.style.opacity = String(Math.max(0, 1 - y / (viewport * 0.75)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduce]);

  return (
    <section className="hero" id="top">
      <HeroCanvas reduce={reduce} />
      <div className="wrap" style={{ width: '100%' }}>
        <div className="hero-inner" ref={innerRef}>
          <p className="motto fade-in" lang="la">Futurum prospice, Mens et Manus.</p>

          <h1
            aria-label={t('hero.h1').replace(/[[\]]/g, '')}
            style={{ animationDelay: 'var(--intro, 0s)' }}
          >
            {headline.map((part, i) => {
              if (part.space) return <span key={i}>{part.text}</span>;
              const delay = `calc(var(--intro, 0s) + ${(0.08 + headlineWordIndex++ * wordDelay).toFixed(3)}s)`;
              const inner = part.em
                ? <em className="wi" style={{ animationDelay: delay }}>{part.text}</em>
                : <span className="wi" style={{ animationDelay: delay }}>{part.text}</span>;
              return <span className="w" aria-hidden="true" key={i}>{inner}</span>;
            })}
          </h1>

          <p className="sub fade-in" style={{ ['--d' as string]: '.65s' }}>
            {t('hero.sub')}
          </p>

          <div className="ctas fade-in" style={{ ['--d' as string]: '.78s' }}>
            <Link className="btn btn-gold" to={contactPath()}>
              <span>{t('nav.book')}</span>
              <ArrowIcon className="ai" />
            </Link>
            <a className="btn btn-line" href="#services" onClick={(e) => go(e, 'services')}>
              {t('hero.cta2')}
            </a>
          </div>

          <p className="meta fade-in" style={{ ['--d' as string]: '.9s' }}>
            <span>
              <b>{t('m.consult')}</b> · <b>{t('m.design')}</b> · <b>{t('m.build')}</b>
            </span>
            <span>{t('hero.remote')}</span>
          </p>
        </div>
      </div>
    </section>
  );
}



