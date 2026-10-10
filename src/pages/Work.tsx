import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { PROJECTS, type Project, type Result, type Shot } from '@/data/work';
import Contact from '@/components/Contact';

function Figure({ shot, eager = false, zoom = false }: { shot: Shot; eager?: boolean; zoom?: boolean }) {
  const { t } = useI18n();
  const img = (
    <img src={shot.src} width={shot.w} height={shot.h} alt={t(shot.cap)} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );
  return (
    <figure className={`wk-fig ${shot.kind ?? 'photo'}`} style={{ '--ar': shot.w / shot.h } as React.CSSProperties}>
      <div className="frame">
        {zoom ? <a href={shot.src} target="_blank" rel="noopener">{img}</a> : img}
      </div>
      <figcaption>{t(shot.cap)}</figcaption>
    </figure>
  );
}

function Figures({ items }: { items: Result[] }) {
  const { t } = useI18n();
  return (
    <dl className="wk-results">
      {items.map((r) => (
        <div key={r.text} className={r.projected ? 'projected' : undefined}>
          <dt>
            <span className={r.fig ? 'ltr' : undefined}>{r.fig ?? t(r.figKey ?? '')}</span>
            {r.projected && <sup aria-hidden="true">*</sup>}
          </dt>
          <dd>{t(r.text)}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "Head: rest of the sentence" → bold head, plain rest. */
function splitLead(s: string): [string, string] {
  const m = s.match(/^([^:：]+)[:：]\s*(.+)$/);
  if (!m) return ['', s];
  const rest = m[2]!;
  return [m[1]!, rest.charAt(0).toUpperCase() + rest.slice(1)];
}

function CaseStudy({ p }: { p: Project }) {
  const { t } = useI18n();
  const hasProjected = p.results.some((r) => r.projected);
  const hasFig = (r: Result) => Boolean(r.fig || r.figKey);
  const measured = p.results.filter((r) => hasFig(r) && !r.projected);
  const notes = p.results.filter((r) => !hasFig(r));
  const projected = p.results.filter((r) => hasFig(r) && r.projected);

  return (
    <article className="wk-case" id={p.id} aria-labelledby={`${p.id}-h`}>
      <div className="wrap">
        <header className="wk-title">
          <h2 className="wk-name" id={`${p.id}-h`} lang="en">{p.name}</h2>
          <p className="wk-tag">{t(`${p.k}.tag`)}</p>
        </header>

        <Figure shot={p.cover} eager={p === PROJECTS[0]} />

        <div className="wk-row">
          <dl className="wk-facts">
            <div><dt>{t('wk.f.for')}</dt><dd>{t(`${p.k}.for`)}</dd></div>
            <div><dt>{t('wk.f.year')}</dt><dd>{p.year}</dd></div>
            <div><dt>{t('wk.f.outcome')}</dt><dd>{t(`${p.k}.outcome`)}</dd></div>
            <div><dt>{t('wk.stack')}</dt><dd lang="en">{p.stack.join(', ')}</dd></div>
            {p.code && (
              <div><dt>{t('wk.f.code')}</dt><dd><a href={p.code} target="_blank" rel="noopener">GitHub</a></dd></div>
            )}
          </dl>
          <div className="wk-prose">
            <h3>{t('wk.problem')}</h3>
            <p>{t(`${p.k}.problem`)}</p>
            <h3>{t('wk.built')}</h3>
            <p>{t(`${p.k}.built`)}</p>
          </div>
        </div>

        <Figure shot={p.diagram} zoom />

        <div className="wk-row">
          <h3 className="wk-side">{t(p.flowTitle)}</h3>
          <div>
            <ol className="wk-steps">
              {p.flow.map((k) => <li key={k}>{t(k)}</li>)}
            </ol>
            {p.safety && <p className="wk-safety">{t(p.safety)}</p>}
          </div>
        </div>

        {p.design && (
          <div className="wk-row">
            <h3 className="wk-side">{t('wk.design')}</h3>
            <dl className="wk-choices">
              {p.design.map((k) => {
                const [head, rest] = splitLead(t(k));
                return <div key={k}><dt>{head}</dt><dd>{rest}</dd></div>;
              })}
            </dl>
          </div>
        )}

        <div className="wk-row">
          <h3 className="wk-side">{t('wk.results')}</h3>
          <div className="wk-results-col">
            {measured.length > 0 && <Figures items={measured} />}
            {notes.length > 0 && (
              <ul className="wk-notes">{notes.map((r) => <li key={r.text}>{t(r.text)}</li>)}</ul>
            )}
            {projected.length > 0 && <Figures items={projected} />}
            {hasProjected && <p className="wk-foot">{t('wk.projNote')}</p>}
          </div>
        </div>

        <div className="wk-gallery">
          {p.gallery.map((s) => <Figure key={s.cap} shot={s} />)}
        </div>
      </div>
    </article>
  );
}

export default function WorkPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t('wk.title')} · Zhetalis`;
    return () => { document.title = 'Zhetalis'; };
  }, [t]);

  return (
    <main className="work">
      <section className="wk-hero">
        <div className="wrap">
          <p className="label">{t('wk.title')}</p>
          <h1>{t('wk.h1')}</h1>
          <p className="lede">{t('wk.lede')} {t('wk.compNote')}</p>
          <ul className="wk-index">
            {PROJECTS.map((p) => (
              <li key={p.id}>
                <Link to={`/work#${p.id}`}>
                  <b lang="en">{p.name}</b>
                  <span>{t(`${p.k}.for`)}</span>
                  <span className="yr">{p.year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {PROJECTS.map((p) => <CaseStudy key={p.id} p={p} />)}

      <Contact />
    </main>
  );
}
