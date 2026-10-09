import { useMemo, useRef } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { parseRichWords } from '@/i18n/rich';
import { useScrollProgress } from '@/hooks/useScrollProgress';

export default function Manifesto() {
  const { t, lang } = useI18n();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = useMemo(() => parseRichWords(t('mani.text')), [t, lang]);
  const p = useScrollProgress(ref, { start: 0.85, end: 0.35 });

  const litCount = Math.round(p * words.filter((w) => !w.space).length);
  let lit = 0;

  return (
    <section className="manifesto" id="manifesto">
      <div className="wrap">
        <p className="label" lang="la">Mens et Manus</p>
        <p className="statement" ref={ref}>
          {words.map((w, i) => {
            if (w.space) return <span key={i}>{w.text}</span>;
            const isLit = lit < litCount;
            lit += 1;
            return (
              <span
                key={i}
                className={`c${w.em ? ' em' : ''}${isLit ? ' lit' : ''}`}
              >
                {w.text}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}