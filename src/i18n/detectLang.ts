import { LANGS, isLang, type Lang } from './translations';

function normLang(code: string): Lang | '' {
  const c = (code || '').toLowerCase().replace('_', '-');
  if (!c) return '';
  if (c.startsWith('zh')) return /hant|-tw|-hk|-mo/.test(c) ? 'zh-Hant' : 'zh-Hans';
  if (c.startsWith('hi')) return 'hi';
  if (c.startsWith('ar')) return 'ar';
  if (c.startsWith('en')) return 'en';
  return '';
}

export function detectLang(): Lang {
  try {
    const q = normLang(new URLSearchParams(location.search).get('lang') ?? '');
    if (q) return q;
  } catch { /* ignore */ }

  try {
    const saved = localStorage.getItem('zhetalis-lang') ?? '';
    if (isLang(saved)) return saved;
  } catch { /* ignore */ }

  const list =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];

  for (const l of list) {
    const n = normLang(l);
    if (n) return n;
  }
  return LANGS[0];
}

export function writeLangToUrl(lang: Lang): void {
  try {
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u.toString());
  } catch { /* ignore */ }
}