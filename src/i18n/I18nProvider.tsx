import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import {
  LANGS, translate, type Lang, type TranslationKey,
} from './translations';
import { detectLang, writeLangToUrl } from './detectLang';

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <K extends TranslationKey>(
    key: K,
    vars?: Record<string, string | number>
  ) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const t = useCallback<I18nValue['t']>(
    (key, vars) => translate(key, lang, vars),
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('zhetalis-lang', lang); } catch { /* ignore */ }
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    writeLangToUrl(l);
  }, []);

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

export { LANGS };