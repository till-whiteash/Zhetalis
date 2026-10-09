import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { LANGS, LANG_NAME, LANG_SHORT } from '@/i18n/translations';
import { GlobeIcon, ChevronIcon } from './icons';

export default function LangPicker() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const cur = listRef.current?.querySelector<HTMLButtonElement>('[aria-current="true"]');
      cur?.focus();
    }
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []
    );
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i + items.length - 1) % items.length]?.focus();
    }
  };

  return (
    <div className="lang" ref={rootRef}>
      <button
        className="lang-btn"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${t('nav.lang')}: ${LANG_NAME[lang]}`}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        <GlobeIcon />
        <span>{LANG_SHORT[lang]}</span>
        <ChevronIcon className="chev" />
      </button>

      {open && (
        <ul className="lang-menu" ref={listRef} onKeyDown={onKeyDown}>
          {LANGS.map((code) => (
            <li key={code}>
              <button
                type="button"
                lang={code}
                dir={code === 'ar' ? 'rtl' : undefined}
                aria-current={code === lang ? 'true' : undefined}
                onClick={() => { setOpen(false); if (code !== lang) setLang(code); }}
              >
                {LANG_NAME[code]} <small>{LANG_SHORT[code]}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}