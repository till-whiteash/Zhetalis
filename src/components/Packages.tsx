import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { SITE, CURRENCIES, type Currency } from '@/data/site';
import { PACKAGES } from '@/data/packages';
import { useInView } from '@/hooks/useInView';
import { contactPath } from '@/lib/useSectionNav';

const LOCALES: Record<string, string> = {
  en: 'en', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW',
  hi: 'hi-IN-u-nu-latn', ar: 'ar-u-nu-latn',
};

function guessCurrency(lang: string): Currency {
  let tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch { /* ignore */ }
  const region = (navigator.language || '').split('-')[1]?.toUpperCase() ?? '';
  const guess =
    tz === 'Asia/Taipei' || region === 'TW' || lang === 'zh-Hant' ? 'TWD'
    : tz === 'Asia/Singapore' || region === 'SG' ? 'SGD'
    : '';
  const idx = SITE.currencies.indexOf(guess as Currency);
  return idx >= 0 ? (guess as Currency) : SITE.currencies[SITE.currencies.length - 1]!;
}

export default function Packages() {
  const { t, lang } = useI18n();
  const [headRef, headIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const [listRef, listIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });

  const [cur, setCur] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('zhetalis-cur') as Currency | null;
      if (saved && SITE.currencies.includes(saved)) return saved;
    } catch { /* ignore */ }
    return guessCurrency(lang);
  });

  useEffect(() => {
    try { localStorage.setItem('zhetalis-cur', cur); } catch { /* ignore */ }
  }, [cur]);

  const hasPrices = Object.values(SITE.prices).some((row) =>
    SITE.currencies.some((c) => row[c] !== '' && row[c] != null)
  );

  const money = (n: number) => {
    try {
      return new Intl.NumberFormat(LOCALES[lang] ?? 'en', {
        style: 'currency', currency: cur, maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${cur} ${n}`;
    }
  };

  return (
    <section className="section" id="packages">
      <div className="wrap">
        <div ref={headRef} className={`head${headIn ? ' in' : ' armed'}`}>
          <p className="label">{t('pk.label')}</p>
          <h2 className="h2">{t('pk.h2')}</h2>
          <p className="lede">{t('pk.lede')}</p>

          {hasPrices && (
            <div className="cur" role="group" aria-label={t('pk.cur')}>
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={cur === c}
                  onClick={() => setCur(c)}
                >{c}</button>
              ))}
            </div>
          )}

          {hasPrices && <p className="price-note">{t('pk.note')}</p>}
        </div>

        <div ref={listRef} className={`pkgs${listIn ? ' in' : ' armed'}`}>
          {PACKAGES.map((pkg) => {
            const raw = SITE.prices[pkg.key][cur];
            const priceText =
              raw !== '' && raw != null
                ? t('pk.from', { price: money(raw) })
                : t('pk.quote');

            return (
              <article className="pkg" key={pkg.key}>
                <p className="label">{t(pkg.tagKey)}</p>
                <h3>{t(pkg.hKey)}</h3>
                <p className="price">{priceText}</p>
                <p>{t(pkg.pKey)}</p>
                <ul className="hexlist">
                  {pkg.items.map((k) => <li key={k}>{t(k)}</li>)}
                </ul>
                <Link className="btn btn-line" to={contactPath(pkg.key)}>
                  {t(pkg.btnKey)}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
