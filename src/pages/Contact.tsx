import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import ProjectBrief from '@/components/ProjectBrief';
import { CalendarIcon, LineIcon, WhatsAppIcon } from '@/components/icons';

const LOCALES: Record<string, string> = {
  en: 'en', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', hi: 'hi-IN-u-nu-latn', ar: 'ar-u-nu-latn',
};

const OFFICES = [
  { key: 'off.sgHQ', tz: 'Asia/Singapore' },
  { key: 'off.tw', tz: 'Asia/Taipei' },
] as const;

const NEXT_STEPS = ['cp.n0', 'cp.n1', 'cp.n2', 'cp.n3'] as const;

/** Mon–Fri, 09:00–18:00 in the office's own time zone. */
function isOpen(tz: string, now: Date): boolean {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: 'numeric', hourCycle: 'h23' })
      .formatToParts(now).map((p) => [p.type, p.value])
  );
  const h = Number(parts.hour);
  return !['Sat', 'Sun'].includes(parts.weekday ?? '') && h >= 9 && h < 18;
}

function useNow(intervalMs = 30000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function ContactPage() {
  const { t, lang } = useI18n();
  const now = useNow();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${t('cp.title')} · Zhetalis`;
    return () => { document.title = 'Zhetalis'; };
  }, [t]);

  const time = (tz?: string) => {
    try {
      return new Intl.DateTimeFormat(LOCALES[lang] ?? 'en', { hour: 'numeric', minute: '2-digit', ...(tz ? { timeZone: tz } : {}) }).format(now);
    } catch { return ''; }
  };
  let myTz = '';
  try { myTz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* ignore */ }

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), key === 'lineNum' ? 3200 : 1600);
    } catch { /* ignore */ }
  };

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;
  const lineHref = SITE.line
    ? SITE.line.startsWith('@')
      ? `https://line.me/R/ti/p/%40${encodeURIComponent(SITE.line.slice(1))}`
      : `https://line.me/ti/p/~${encodeURIComponent(SITE.line)}`
    : '';

  const direct = [
    { key: 'email', label: t('ct.email'), value: SITE.email, href: `mailto:${SITE.email}` },
    { key: 'phone', label: t('ct.phoneSG'), value: SITE.phone, href: `tel:${SITE.phone.replace(/\s+/g, '')}` },
    { key: 'phoneTW', label: t('ct.phoneTW'), value: SITE.phoneTW, href: `tel:${SITE.phoneTW.replace(/\s+/g, '')}` },
  ].filter((d) => d.value);

  return (
    <main>
      <section className="cp-hero">
        <div className="wrap">
          <Link className="back-link" to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            <span>{t('cp.back')}</span>
          </Link>
          <p className="label">{t('cp.title')}</p>
          <h1>{t('cp.h1')}</h1>
          <p className="lede">{t('cp.lede')}</p>
        </div>
      </section>

      <div className="wrap cp-grid" id="brief">
        <div><ProjectBrief /></div>

        <aside className="cp-side">
          <section>
            <h2>{t('cp.next.h')}</h2>
            <ol className="next-list">
              {NEXT_STEPS.map((k) => <li key={k}>{t(k)}</li>)}
            </ol>
          </section>

          <section>
            <h2>{t('cp.office.h')}</h2>
            {OFFICES.map((o) => {
              const open = isOpen(o.tz, now);
              const theirs = time(o.tz);
              const mine = time();
              return (
                <div className="office" key={o.tz}>
                  <b>{t(o.key)}</b>
                  <span className="meta">{t('ct.hoursVal')}</span>
                  <span className={`status${open ? ' open' : ''}`}>
                    <i />
                    <span>
                      {open ? t('cp.open') : t('cp.closed')} · {t('cp.theirTime', { time: theirs })}
                      {myTz && myTz !== o.tz && mine !== theirs && <> · {t('cp.yourTime', { time: mine })}</>}
                    </span>
                  </span>
                </div>
              );
            })}
          </section>

          <section>
            <h2>{t('cp.direct.h')}</h2>
            <div className="direct">
              {direct.map((d) => (
                <div className="row" key={d.key}>
                  <span className="k">{d.label}</span>
                  <a className="ltr" href={d.href}>{d.value}</a>
                  <button className="copy" type="button" onClick={() => copy(d.key, d.value)}>
                    {copied === d.key ? t('ct.copied') : t('ct.copy')}
                  </button>
                </div>
              ))}
            </div>
            <div className="chat-row">
              <a className="btn btn-line" href={waHref} target="_blank" rel="noopener"><WhatsAppIcon /> <span>{t('ct.wa')}</span></a>
              {lineHref ? (
                <a className="btn btn-line" href={lineHref} target="_blank" rel="noopener"><LineIcon /> <span>{t('ct.line')}</span></a>
              ) : (
                <button className="btn btn-line" type="button" onClick={() => copy('lineNum', SITE.phoneTW)}>
                  <LineIcon /> <span>{copied === 'lineNum' ? t('ct.lineNum') : t('ct.line')}</span>
                </button>
              )}
              {SITE.booking && (
                <a className="btn btn-line" href={SITE.booking} target="_blank" rel="noopener"><CalendarIcon /> <span>{t('ct.book')}</span></a>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
