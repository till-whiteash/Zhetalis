import { SITE } from '@/data/site';
import type { Brief } from '@/data/brief';

/**
 * Briefs are delivered by FormSubmit (https://formsubmit.co), which emails them to SITE.email.
 * It works from any host, so it doesn't depend on Netlify form detection (which can't see forms React renders).
 *
 * ONE-TIME SETUP: the first brief sent from the live site triggers an activation email to SITE.email.
 * Click the link in it once. Until then FormSubmit answers { success: "false" } and the page offers
 * the visitor an email fallback instead, so no enquiry is silently lost.
 */
const ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(SITE.email)}`;

export function makeReference(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZH-${String(date.getFullYear()).slice(2)}${p(date.getMonth() + 1)}${p(date.getDate())}-${rand}`;
}

export function visitorTimeZone(): string {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { return ''; }
}

/** The brief as English label/value rows, which is what the team reads in their inbox. */
export function briefRows(b: Brief): [string, string][] {
  const rows: [string, string][] = [
    ['Service', b.service],
    ['Project type', b.types.join(', ')],
    ['Current stage', b.stage],
    ['Timeline', b.timeline],
    ['Budget', b.budget],
    ['Goal or problem', b.message],
    ['Links', b.links],
    ['Name', b.name],
    ['Email', b.email],
    ['Company', b.company],
    ['Role', b.role],
    ['Preferred contact', b.contact],
    ['Phone / WhatsApp', b.phone],
    ['Call time (their time)', b.callTime],
    ['Call language', b.callLang],
    ['Heard about us', b.source],
  ];
  return rows.filter(([, v]) => v.trim() !== '');
}

function subject(b: Brief, ref: string): string {
  return `Project brief ${ref} · ${b.name}${b.company ? ` (${b.company})` : ''}`;
}

/** A pre-filled email, used when sending from the page fails. */
export function mailtoHref(b: Brief, ref: string, siteLanguage: string): string {
  const tz = visitorTimeZone();
  const body = [
    `Reference: ${ref}`,
    '',
    ...briefRows(b).map(([k, v]) => `${k}: ${v}`),
    '',
    `Site language: ${siteLanguage}`,
    tz ? `Time zone: ${tz}` : '',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject(b, ref))}&body=${encodeURIComponent(body)}`;
}

export async function sendBrief(b: Brief, ref: string, siteLanguage: string): Promise<void> {
  const payload: Record<string, string> = {
    _subject: `New ${subject(b, ref)}`,
    _replyto: b.email,
    _template: 'table',
    _captcha: 'false',
    Reference: ref,
  };
  for (const [k, v] of briefRows(b)) payload[k] = v;
  payload['Site language'] = siteLanguage;
  const tz = visitorTimeZone();
  if (tz) payload['Time zone'] = tz;
  payload['Sent from'] = location.origin + location.pathname;

  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    if (!res.ok || String(json.success) !== 'true') {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
  } finally {
    window.clearTimeout(timer);
  }
}
