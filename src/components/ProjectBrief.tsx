import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { LANG_NAME } from '@/i18n/translations';
import { SITE, type Currency } from '@/data/site';
import {
  SERVICE_OPTIONS, TYPE_OPTIONS, STAGE_OPTIONS, TIMELINE_OPTIONS, BUDGETS, BUDGET_UNSURE,
  CONTACT_OPTIONS, NEEDS_PHONE, CALL_TIME_OPTIONS, CALL_LANG_OPTIONS, MESSAGE_MAX,
  type Brief, type BriefOption,
} from '@/data/brief';
import { makeReference, mailtoHref, sendBrief, visitorTimeZone } from '@/lib/sendBrief';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ArrowIcon, WhatsAppIcon } from './icons';

const DRAFT_KEY = 'zhetalis-brief';
type Step = 1 | 2 | 3;
type Status = 'editing' | 'sending' | 'failed' | 'sent';
type Errors = Partial<Record<'service' | 'message' | 'name' | 'email' | 'phone', string>>;

function initialCurrency(): Currency {
  try {
    const saved = localStorage.getItem('zhetalis-cur') as Currency | null;
    if (saved && SITE.currencies.includes(saved)) return saved;
  } catch { /* ignore */ }
  const tz = visitorTimeZone();
  return tz === 'Asia/Taipei' ? 'TWD' : tz === 'Asia/Singapore' ? 'SGD' : 'USD';
}

const EMPTY: Brief = {
  service: '', types: [], stage: '', message: '', timeline: '',
  currency: 'USD', budget: '', links: '',
  name: '', email: '', company: '', role: '',
  contact: 'Email', phone: '', callTime: '', callLang: '', source: '',
};

function loadDraft(): Brief {
  const base: Brief = { ...EMPTY, currency: initialCurrency() };
  try {
    const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null') as Partial<Brief> | null;
    if (saved && typeof saved === 'object') return { ...base, ...saved, types: Array.isArray(saved.types) ? saved.types : [] };
  } catch { /* ignore */ }
  return base;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ProjectBrief() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const [params] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLElement>(null);

  const [brief, setBrief] = useState<Brief>(() => {
    const draft = loadDraft();
    // ?service=design etc. from the homepage packages and services
    const svc = SERVICE_OPTIONS.find((o) => o.id === params.get('service'));
    return svc ? { ...draft, service: svc.value } : draft;
  });
  const [step, setStep] = useState<Step>(1);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('editing');
  const [reference, setReference] = useState('');
  const [savedNote, setSavedNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [bot, setBot] = useState('');

  // keep a draft on this device while they type
  useEffect(() => {
    if (status === 'sent') return;
    const id = window.setTimeout(() => {
      const dirty = JSON.stringify(brief) !== JSON.stringify({ ...EMPTY, currency: brief.currency });
      if (!dirty) return;
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(brief)); setSavedNote(true); } catch { /* ignore */ }
    }, 400);
    return () => window.clearTimeout(id);
  }, [brief, status]);

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    setBrief((b) => ({ ...b, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const toggleType = (value: string) =>
    set('types', brief.types.includes(value) ? brief.types.filter((v) => v !== value) : [...brief.types, value]);

  const needsPhone = NEEDS_PHONE.includes(brief.contact);

  const validate = (s: Step): boolean => {
    const next: Errors = {};
    if (s === 1 && !brief.service) next.service = t('cp.ePick');
    if (s === 2 && brief.message.trim().length < 3) next.message = t('f.eMsg');
    if (s === 3) {
      if (!brief.name.trim()) next.name = t('f.eName');
      if (!EMAIL_RE.test(brief.email.trim())) next.email = t('f.eEmail');
      if (needsPhone && brief.phone.replace(/\D/g, '').length < 7) next.phone = t('cp.ePhone');
    }
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .cards input')?.focus();
      });
      return false;
    }
    return true;
  };

  const scrollToForm = () => {
    const el = formRef.current?.parentElement;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 70) window.scrollTo({ top: top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' });
  };

  const goTo = (s: Step) => {
    if (s > step && !validate(step)) return;
    setStep(s);
    scrollToForm();
    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>(`[data-step="${s}"] input:not([type=hidden]), [data-step="${s}"] textarea`)
        ?.focus({ preventScroll: true });
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { goTo((step + 1) as Step); return; }
    for (const s of [1, 2, 3] as Step[]) {
      if (!validate(s)) { setStep(s); return; }
    }
    if (bot) return; // honeypot: filled only by bots

    const ref = makeReference();
    setReference(ref);
    setStatus('sending');
    try {
      await sendBrief(brief, ref, LANG_NAME[lang]);
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      setStatus('sent');
      requestAnimationFrame(() => { doneRef.current?.focus({ preventScroll: true }); scrollToForm(); });
    } catch {
      setStatus('failed');
    }
  };

  const reset = () => {
    setBrief({ ...EMPTY, currency: brief.currency });
    setErrors({});
    setStep(1);
    setStatus('editing');
    setSavedNote(false);
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  };

  const label = (o: BriefOption | { value: string; label: string }) => ('key' in o ? t(o.key) : o.label);
  const labelOf = (list: readonly (BriefOption | { value: string; label: string })[], value: string) => {
    const o = list.find((x) => x.value === value);
    return o ? label(o) : value;
  };
  const svcOf = (value: string) => {
    const o = SERVICE_OPTIONS.find((x) => x.value === value);
    return o ? t(o.key) : value;
  };

  /** The brief in the visitor's own language, for the confirmation screen and "copy my brief". */
  const localRows = (): [string, string][] => ([
    [t('cp.q.service'), brief.service ? svcOf(brief.service) : ''],
    [t('cp.q.type'), brief.types.map((v) => labelOf(TYPE_OPTIONS, v)).join(', ')],
    [t('cp.q.stage'), brief.stage ? labelOf(STAGE_OPTIONS, brief.stage) : ''],
    [t('cp.q.timeline'), brief.timeline ? labelOf(TIMELINE_OPTIONS, brief.timeline) : ''],
    [t('cp.q.budget'), brief.budget === BUDGET_UNSURE ? t('f.unsure') : brief.budget],
    [t('cp.q.desc'), brief.message],
    [t('cp.q.links'), brief.links],
    [t('f.name'), brief.name],
    [t('f.email'), brief.email],
    [t('f.company'), brief.company],
    [t('cp.role'), brief.role],
    [t('cp.q.contact'), brief.contact ? labelOf(CONTACT_OPTIONS, brief.contact) : ''],
    [t('f.phone'), brief.phone],
    [t('cp.q.time'), brief.callTime ? labelOf(CALL_TIME_OPTIONS, brief.callTime) : ''],
    [t('cp.q.lang'), CALL_LANG_OPTIONS.find((o) => o.value === brief.callLang)?.label ?? ''],
    [t('cp.q.source'), brief.source],
  ] as [string, string][]).filter(([, v]) => v.trim() !== '');

  const copyBrief = async () => {
    const text = `${t('cp.ok.ref')}: ${reference}\n\n${localRows().map(([k, v]) => `${k}: ${v}`).join('\n')}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  };

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;

  /* ---------- sent ---------- */
  if (status === 'sent') {
    return (
      <section className="brief done-panel" ref={doneRef} tabIndex={-1} aria-live="polite">
        <p className="label">{t('cp.title')}</p>
        <h2>{t('cp.ok.h')}</h2>
        <p className="lede">{t('cp.ok.p', { name: brief.name.trim().split(/\s+/)[0] ?? '', email: brief.email })}</p>
        <p className="ref"><span>{t('cp.ok.ref')}</span><b dir="ltr">{reference}</b></p>
        <dl className="summary">
          {localRows().map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <div className="brief-actions">
          <button className="btn btn-line" type="button" onClick={copyBrief}>{copied ? t('ct.copied') : t('cp.ok.copy')}</button>
          <button className="btn btn-line" type="button" onClick={reset}>{t('cp.ok.new')}</button>
          <Link className="btn btn-line" to="/">{t('cp.back')}</Link>
        </div>
      </section>
    );
  }

  /* ---------- editing ---------- */
  const steps = [
    { n: 1 as Step, key: 'cp.s1' },
    { n: 2 as Step, key: 'cp.s2' },
    { n: 3 as Step, key: 'cp.s3' },
  ];
  const stepLabel = (n: number) => t('cp.step', { n });

  return (
    <form className="brief" ref={formRef} noValidate onSubmit={onSubmit}>
      <ol className="progress" aria-hidden="true">
        {steps.map((s) => (
          <li key={s.n} className={s.n === step ? 'on' : s.n < step ? 'done' : undefined}>
            <span>{stepLabel(s.n)}</span><b>{t(s.key)}</b>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">{stepLabel(step)}: {t(`cp.s${step}`)}</p>
      <input
        className="hp" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={bot} onChange={(e) => setBot(e.target.value)}
      />

      {step === 1 && (
        <div className="step-panel" data-step="1" key="s1">
          <fieldset className="q">
            <legend>{t('cp.q.service')}</legend>
            <div className="cards">
              {SERVICE_OPTIONS.map((o) => (
                <label className="card" key={o.id}>
                  <input
                    type="radio" name="service" value={o.value}
                    checked={brief.service === o.value}
                    onChange={() => set('service', o.value)}
                    aria-invalid={!!errors.service && !brief.service}
                  />
                  <span className="box"><b>{t(o.key)}</b><small>{t(o.descKey)}</small></span>
                </label>
              ))}
            </div>
            {errors.service && <span className="err">{errors.service}</span>}
          </fieldset>

          <fieldset className="q">
            <legend>{t('cp.q.type')}</legend>
            <p className="hint">{t('cp.multi')}</p>
            <div className="pick">
              {TYPE_OPTIONS.map((o) => (
                <label key={o.value}>
                  <input type="checkbox" checked={brief.types.includes(o.value)} onChange={() => toggleType(o.value)} />
                  <span>{t(o.key)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <ChipRadios legend={t('cp.q.stage')} name="stage" options={STAGE_OPTIONS} value={brief.stage}
            onChange={(v) => set('stage', v)} label={label} />

          <div className="nav-row">
            <span className="left">{savedNote && t('cp.saved')}</span>
            <button className="btn btn-gold" type="button" onClick={() => goTo(2)}>
              <span>{t('cp.next')}</span> <ArrowIcon className="ai" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-panel" data-step="2" key="s2">
          <label className="q field">
            <span className="qlabel">{t('cp.q.desc')}</span>
            <textarea
              name="message" rows={6} maxLength={MESSAGE_MAX} required
              placeholder={t('cp.descPh')}
              value={brief.message} onChange={(e) => set('message', e.target.value)}
              aria-invalid={!!errors.message}
            />
            <span className="counter">{brief.message.length} / {MESSAGE_MAX}</span>
            {errors.message && <span className="err">{errors.message}</span>}
          </label>

          <ChipRadios legend={t('cp.q.timeline')} name="timeline" options={TIMELINE_OPTIONS} value={brief.timeline}
            onChange={(v) => set('timeline', v)} label={label} />

          <fieldset className="q">
            <legend>{t('cp.q.budget')}</legend>
            <p className="hint">{t('cp.budgetHint')}</p>
            <div className="cur" role="group" aria-label={t('pk.cur')}>
              {SITE.currencies.map((c) => (
                <button
                  key={c} type="button" aria-pressed={brief.currency === c}
                  onClick={() => {
                    setBrief((b) => ({ ...b, currency: c, budget: b.budget === BUDGET_UNSURE ? b.budget : '' }));
                    try { localStorage.setItem('zhetalis-cur', c); } catch { /* ignore */ }
                  }}
                >{c}</button>
              ))}
            </div>
            <div className="pick">
              {BUDGETS[brief.currency].map((r) => {
                const v = `${brief.currency} ${r}`;
                return (
                  <label key={v}>
                    <input type="radio" name="budget" checked={brief.budget === v} onChange={() => set('budget', v)} />
                    <span dir="ltr">{v}</span>
                  </label>
                );
              })}
              <label>
                <input type="radio" name="budget" checked={brief.budget === BUDGET_UNSURE} onChange={() => set('budget', BUDGET_UNSURE)} />
                <span>{t('f.unsure')}</span>
              </label>
            </div>
          </fieldset>

          <label className="q field">
            <span><span className="qlabel">{t('cp.q.links')}</span> <span className="opt">{t('f.optional')}</span></span>
            <input name="links" dir="ltr" placeholder={t('cp.linksPh')} value={brief.links} onChange={(e) => set('links', e.target.value)} />
          </label>

          <div className="nav-row">
            <button className="btn btn-line" type="button" onClick={() => goTo(1)}>{t('cp.prev')}</button>
            <button className="btn btn-gold" type="button" onClick={() => goTo(3)}>
              <span>{t('cp.next')}</span> <ArrowIcon className="ai" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-panel" data-step="3" key="s3">
          <div className="form-row">
            <label className="field">
              <span>{t('f.name')}</span>
              <input name="name" autoComplete="name" required value={brief.name}
                onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} />
              {errors.name && <span className="err">{errors.name}</span>}
            </label>
            <label className="field">
              <span>{t('f.email')}</span>
              <input name="email" type="email" autoComplete="email" required dir="ltr" value={brief.email}
                onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} />
              {errors.email && <span className="err">{errors.email}</span>}
            </label>
          </div>
          <div className="form-row">
            <label className="field">
              <span>{t('f.company')} <span className="opt">{t('f.optional')}</span></span>
              <input name="company" autoComplete="organization" value={brief.company} onChange={(e) => set('company', e.target.value)} />
            </label>
            <label className="field">
              <span>{t('cp.role')} <span className="opt">{t('f.optional')}</span></span>
              <input name="role" autoComplete="organization-title" value={brief.role} onChange={(e) => set('role', e.target.value)} />
            </label>
          </div>

          <ChipRadios legend={t('cp.q.contact')} name="contact" options={CONTACT_OPTIONS} value={brief.contact}
            onChange={(v) => { set('contact', v); setErrors((e) => ({ ...e, phone: undefined })); }} label={label} />

          <label className="field">
            <span>{t('f.phone')} {!needsPhone && <span className="opt">{t('f.optional')}</span>}</span>
            <input name="phone" type="tel" autoComplete="tel" dir="ltr" placeholder="+65 / +886 …" value={brief.phone}
              onChange={(e) => set('phone', e.target.value)} aria-invalid={!!errors.phone} />
            {errors.phone && <span className="err">{errors.phone}</span>}
          </label>

          <div className="form-row">
            <ChipRadios legend={t('cp.q.time')} name="callTime" options={CALL_TIME_OPTIONS} value={brief.callTime}
              onChange={(v) => set('callTime', v)} label={label} />
            <fieldset className="q">
              <legend>{t('cp.q.lang')}</legend>
              <div className="pick">
                {CALL_LANG_OPTIONS.map((o) => (
                  <label key={o.value}>
                    <input type="radio" name="callLang" checked={brief.callLang === o.value} onChange={() => set('callLang', o.value)} />
                    <span lang={o.lang}>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <label className="field">
            <span>{t('cp.q.source')} <span className="opt">{t('f.optional')}</span></span>
            <input name="source" value={brief.source} onChange={(e) => set('source', e.target.value)} />
          </label>

          {status === 'failed' && (
            <div className="fail-box" role="alert">
              <span>{t('cp.fail')}</span>
              <div className="brief-actions">
                <a className="btn btn-gold" href={mailtoHref(brief, reference, LANG_NAME[lang])}>{t('cp.mail')}</a>
                <a className="btn btn-line" href={waHref} target="_blank" rel="noopener"><WhatsAppIcon /> <span>{t('ct.wa')}</span></a>
              </div>
            </div>
          )}

          <div className="nav-row">
            <button className="btn btn-line" type="button" onClick={() => goTo(2)}>{t('cp.prev')}</button>
            <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
              <span>{status === 'sending' ? t('f.sending') : t('cp.send')}</span> <ArrowIcon className="ai" />
            </button>
          </div>
          <p className="note">{t('cp.privacy')}</p>
        </div>
      )}
    </form>
  );
}

interface ChipRadiosProps {
  legend: string;
  name: string;
  options: readonly (BriefOption | { value: string; label: string })[];
  value: string;
  onChange: (value: string) => void;
  label: (o: BriefOption | { value: string; label: string }) => string;
}

function ChipRadios({ legend, name, options, value, onChange, label }: ChipRadiosProps) {
  return (
    <fieldset className="q">
      <legend>{legend}</legend>
      <div className="pick">
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{label(o)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
