import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { TEAM } from '@/data/team';
import Reveal from '@/components/Reveal';
import { PROJECTS } from '@/data/work';
import Contact from '@/components/Contact';
import { ArrowIcon } from '@/components/icons';
import logoMark from '@/assets/logo-mark.png';

const PRINCIPLES = ['ab.p0', 'ab.p1', 'ab.p2', 'ab.p3', 'ab.p4'] as const;
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
        <div className="wrap ab-hero-grid">
          <div className="ab-hero-text">
            <p className="label">{t('ab.title')}</p>
            <h1>{t('ab.h1')}</h1>
            <p className="lede">{t('hero.sub')}</p>
          </div>
          <img className="ab-mark" src={logoMark} alt="" width={280} height={220} />
        </div>
      </section>

      {/* Mens et Manus */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label" lang="la">Futurum prospice, Mens et Manus</p>
            <h2 className="h2">{t('ab.motto.h')}</h2>
            <p className="lede">{t('ab.motto.p')}</p>
          </Reveal>
          <Reveal className="mm">
            <article>
              <p className="mm-word" lang="la">Mens</p>
              <h3>{t('ab.mind.h')}</h3>
              <p>{t('ab.mind.p')}</p>
            </article>
            <article>
              <p className="mm-word" lang="la">Manus</p>
              <h3>{t('ab.hand.h')}</h3>
              <p>{t('ab.hand.p')}</p>
            </article>
          </Reveal>
          <Reveal>
            <p className="ab-statement">{t('mani.text').replace(/[[\]]/g, '')}</p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="section">
        <div className="wrap">
          <Reveal className="head">
            <p className="label">{t('ab.pr.label')}</p>
            <h2 className="h2">{t('ab.pr.h2')}</h2>
          </Reveal>
          <Reveal className="principles">
            {PRINCIPLES.map((k, i) => (
              <article key={k}>
                <span className="k">{String(i + 1).padStart(2, '0')}</span>
                <h3>{t(`${k}.h`)}</h3>
                <p>{t(`${k}.p`)}</p>
              </article>
            ))}
          </Reveal>
          <Link className="arrow-link" to="/#approach">
            <span>{t('ab.how')}</span> <ArrowIcon className="ai" />
          </Link>
        </div>
      </section>

      {/* Offices */}
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

      {/* Team: hidden until src/data/team.ts has people in it */}
      {TEAM.length > 0 && (
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
                    ? <img src={m.photo} alt="" />
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
      )}

      {/* Selected work */}
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
                <b lang="en">{p.name}</b>
                <span>{t(`${p.k}.tag`)}</span>
                <span className="arrow-link"><span>{t('wk.read')}</span> <ArrowIcon className="ai" /></span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <Contact />
    </main>
  );
}
