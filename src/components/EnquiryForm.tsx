import { useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useInView } from '@/hooks/useInView';
import { ArrowIcon } from './icons';

type Status = 'idle' | 'sending' | 'ok' | 'warn';

const SERVICE_OPTIONS = [
  { id: 's-consult', value: 'Consultation', key: 'f.o0' },
  { id: 's-design',  value: 'Design and plan', key: 'f.o1' },
  { id: 's-tech',    value: 'Build and support', key: 'f.o2' },
  { id: 's-unsure',  value: 'Not sure yet', key: 'f.unsure' },
] as const;

interface Props {
  /** forwarded from Packages: which checkbox to preselect */
  preselect: string | null;
}

export default function EnquiryForm({ preselect }: Props) {
  const { t, lang } = useI18n();
  const [ref, inView] = useInView<HTMLFormElement>({ rootMargin: '0px 0px -10% 0px' });
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [note, setNote] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; msg?: string }>({});

  const validate = (form: HTMLFormElement) => {
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const msg = form.elements.namedItem('message') as HTMLTextAreaElement;
    const next: typeof errors = {};
    if (!name.checkValidity()) next.name = t('f.eName');
    if (!email.checkValidity()) next.email = t('f.eEmail');
    if (!msg.checkValidity()) next.msg = t('f.eMsg');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!validate(form)) {
      setStatus('warn');
      setNote(t('f.fix'));
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const hosted =
      /^https?:$/.test(location.protocol) &&
      !/claude|anthropic|localhost|127\.0\.0\.1/.test(location.hostname);

    if (!hosted) {
      setStatus('warn');
      setNote(`${t('f.offline')} ${t('f.fallback')}`);
      return;
    }

    setStatus('sending');
    setNote(t('f.sending'));

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as never).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('ok');
      setNote(t('f.ok'));
    } catch {
      setStatus('warn');
      setNote(`${t('f.fail')} ${t('f.fallback')}`);
    }
  };

  return (
    <form
      ref={(el) => { formRef.current = el; (ref as React.MutableRefObject<HTMLFormElement | null>).current = el; }}
      className={`form${inView ? '' : ' armed'}`}
      name="enquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      noValidate
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="enquiry" />
      <input type="hidden" name="language" value={lang} />
      <input
        type="hidden"
        name="timezone"
        value={(() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; } })()}
      />
      <p hidden>
        <label>Leave this empty <input name="bot-field" /></label>
      </p>

      <div className="row">
        <label className="field">
          <span>{t('f.name')}</span>
          <input name="name" autoComplete="name" required aria-invalid={!!errors.name} />
          {errors.name && <span className="err">{errors.name}</span>}
        </label>
        <label className="field">
          <span>{t('f.email')}</span>
          <input name="email" type="email" autoComplete="email" required dir="ltr" aria-invalid={!!errors.email} />
          {errors.email && <span className="err">{errors.email}</span>}
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>{t('f.company')} <span className="opt">{t('f.optional')}</span></span>
          <input name="company" autoComplete="organization" />
        </label>
        <label className="field">
          <span>{t('f.phone')} <span className="opt">{t('f.optional')}</span></span>
          <input name="phone" type="tel" autoComplete="tel" dir="ltr" />
        </label>
      </div>

      <fieldset>
        <legend>{t('f.interest')}</legend>
        <div className="pick">
          {SERVICE_OPTIONS.map((o) => (
            <label key={o.id}>
              <input
                type="checkbox"
                name="service"
                value={o.value}
                defaultChecked={preselect === o.id}
                key={`${o.id}-${preselect}`}
              />
              <span>{t(o.key)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>{t('f.msg')}</span>
        <textarea name="message" rows={4} required aria-invalid={!!errors.msg} />
        {errors.msg && <span className="err">{errors.msg}</span>}
      </label>

      <button className="btn btn-gold" type="submit" disabled={status === 'sending'}>
        <span>{t('f.submit')}</span> <ArrowIcon className="ai" />
      </button>

      <p className={`note${status === 'warn' ? ' warn' : status === 'ok' ? ' ok' : ''}`} aria-live="polite">
        {note ?? t('f.note')}
      </p>
    </form>
  );
}