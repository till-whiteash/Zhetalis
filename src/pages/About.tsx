import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { TEAM } from '@/data/team';
import { STEPS } from '@/data/steps';
import Reveal from '@/components/Reveal';
import { PROJECTS } from '@/data/work';
import Contact from '@/components/Contact';
import { ArrowIcon } from '@/components/icons';
import logoMark from '@/assets/logo-mark.png';

type AbStar = { x: number; y: number; s?: number; o?: number; d?: number; delay?: number; spark?: boolean };
// Decorative star field for the About hero only (positions are % of the hero box).
const AB_STARS: AbStar[] = [
  { x: 46, y: 16, o: 0.6, d: 4.0, delay: 0.2 },
  { x: 52, y: 30, s: 1.3, o: 0.8, d: 5.0, delay: 0.6 },
  { x: 58, y: 12, s: 0.8, o: 0.45, d: 4.5, delay: 1.1 },
  { x: 63, y: 40, o: 0.6, d: 4.0, delay: 0.3 },
  { x: 49, y: 52, s: 0.9, o: 0.5, d: 5.0, delay: 1.4 },
  { x: 55, y: 68, s: 1.1, o: 0.7, d: 4.2, delay: 0.8 },
  { x: 60, y: 82, s: 0.8, o: 0.4, d: 5.0, delay: 0.2 },
  { x: 68, y: 22, o: 0.6, d: 4.0, delay: 1.6 },
  { x: 70, y: 8,  s: 0.9, o: 0.5, d: 4.8, delay: 0.3 },
  { x: 92, y: 18, s: 1.2, o: 0.75, d: 4.5, delay: 0.4 },
  { x: 88, y: 34, s: 0.9, o: 0.5, d: 5.0, delay: 1.0 },
  { x: 95, y: 48, o: 0.6, d: 4.0, delay: 0.7 },
  { x: 90, y: 64, s: 1.3, o: 0.8, d: 4.3, delay: 0.2 },
  { x: 84, y: 80, s: 0.9, o: 0.5, d: 5.0, delay: 1.2 },
  { x: 78, y: 90, o: 0.55, d: 4.6, delay: 0.5 },
  { x: 73, y: 58, s: 0.8, o: 0.4, d: 5.0, delay: 1.5 },
  { x: 97, y: 74, s: 1.1, o: 0.65, d: 4.2, delay: 0.9 },
  { x: 66, y: 30, o: 0.9, d: 5.0, delay: 0.5, spark: true },
  { x: 86, y: 52, o: 0.85, d: 6.0, delay: 1.2, spark: true },
  { x: 94, y: 86, s: 0.9, o: 0.8, d: 5.5, delay: 0.2, spark: true },
];

// Same order as the company portfolio: summary, team, core services, capabilities, projects, method, contact
const CORE = ['ab.cs0', 'ab.cs1', 'ab.cs2'] as const;
const CAPS = ['ab.cap0', 'ab.cap1', 'ab.cap2', 'ab.cap3', 'ab.cap4', 'ab.cap5'] as const;
const OFFICES = [
  { key: 'off.sgHQ', city: 'off.sg' },
  { key: 'off.tw', city: 'off.tw' },
] as const;

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
}

export default function AboutPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t('ab.title')} · Zhetalis`;
    return () => { document.title = 'Zhetalis'; };
  }, [t]);

  return (
    <main className="about">
      <section className="ab-hero">
        <div className="ab-stars" aria-hidden="true">
          {AB_STARS.map((st, i) => (
            <i
              key={i}
              className={st.spark ? 'spark' : undefined}
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                ['--s' as never]: st.s ?? 1,
                ['--o' as never]: st.o ?? 0.6,
                ['--d' as never]: `${st.d ?? 4.5}s`,
                ['--delay' as never]: `${st.delay ?? 0}s`,
              }}
            />
          ))}
        </div>
        <div className="wrap ab-hero-grid">
          <div className="ab-hero-text">
            <p className="label">{t('ab.title')}</p>
            <h1>{t('ab.h1')}</h1>
            <p className="lede">{t('ab.lede')}</p>
            <p className="ab-motto" lang="la">Futurum prospice, Mens et Manus</p>
          </div>
          <img className="ab-mark" src={logoMark} alt="" width={280} height={220} />
        </div>
      </section>

      {/* The team */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.team.label')}</p>
            <h2 className="h2">{t('ab.team.h2')}</h2>
          </Reveal>
          <Reveal className="team">
            {TEAM.map((m) => (
              <article key={m.name}>
                {m.photo
                  ? <img src={m.photo} alt={m.name} width={240} height={240} loading="lazy" />
                  : <span className="avatar" aria-hidden="true">{initials(m.name)}</span>}
                <h3>{m.name}</h3>
                <p className="role">{m.role}{m.base ? ` · ${m.base}` : ''}</p>
                {m.bio && <p>{m.bio}</p>}
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Core services */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.cs.label')}</p>
            <h2 className="h2">{t('ab.cs.h2')}</h2>
          </Reveal>
          <Reveal className="ab-core">
            {CORE.map((k, i) => (
              <article key={k}>
                <span className="k">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(`${k}.h`)}</h3>
                <p>{t(`${k}.p`)}</p>
              </article>
            ))}
          </Reveal>
          <Link className="arrow-link" to="/services">
            <span>{t('hero.cta2')}</span> <ArrowIcon className="ai" />
          </Link>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.cap.label')}</p>
            <h2 className="h2">{t('ab.cap.h2')}</h2>
          </Reveal>
          <Reveal className="ab-caps">
            {CAPS.map((k) => (
              <article key={k}>
                <h3>{t(`${k}.h`)}</h3>
                <p>{t(`${k}.p`)}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.work.label')}</p>
            <h2 className="h2">{t('ab.work.h2')}</h2>
          </Reveal>
          <Reveal className="wk-teasers">
            {PROJECTS.map((p) => (
              <Link className="wk-teaser" key={p.id} to={`/work#${p.id}`}>
                <span className={`thumb ${p.cover.kind ?? 'photo'}`}><img src={p.cover.src} width={p.cover.w} height={p.cover.h} alt="" loading="lazy" /></span>
                <span className="ev">{t(`${p.k}.for`)}</span>
                <b lang="en">{p.name}</b>
                <span>{t(`${p.k}.tag`)}</span>
                <span className="arrow-link"><span>{t('wk.read')}</span> <ArrowIcon className="ai" /></span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Methodology */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.pr.label')}</p>
            <h2 className="h2">{t('ab.meth.h2')}</h2>
          </Reveal>
          <Reveal className="ab-core ab-steps">
            {STEPS.map((s) => (
              <article key={s.n}>
                <span className="k">{s.n}</span>
                <h3>{t(s.hKey)}</h3>
                <p>{t(s.pKey)}</p>
              </article>
            ))}
          </Reveal>
          <Link className="arrow-link" to="/services#approach">
            <span>{t('ab.how')}</span> <ArrowIcon className="ai" />
          </Link>
        </div>
      </section>

      {/* Where we are */}
      <section className="section">
        <div className="wrap ab-where">
          <Reveal className="head">
            <p className="label">{t('ab.where.label')}</p>
            <h2 className="h2">{t('ab.where.h2')}</h2>
            <p className="lede">{t('ab.where.p')}</p>
          </Reveal>
          <Reveal className="ab-offices">
            {OFFICES.map((o) => (
              <div className="ab-office" key={o.key}>
                <b>{t(o.key)}</b>
                <span>{t('ct.hoursVal')}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Contact />
    </main>
  );
}
