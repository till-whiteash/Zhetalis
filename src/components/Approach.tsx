import { useRef } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { STEPS } from '@/data/steps';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useInView } from '@/hooks/useInView';

export default function Approach() {
  const { t } = useI18n();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [headRef, headIn] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });
  const p = useScrollProgress(timelineRef, { start: 0.6, end: 0.4 });

  return (
    <section className="section" id="approach">
      <div className="wrap">
        <div ref={headRef} className={`head${headIn ? ' in' : ' armed'}`}>
          <p className="label">{t('ap.label')}</p>
          <h2 className="h2">{t('ap.h2')}</h2>
          <p className="lede">{t('ap.lede')}</p>
        </div>

        <div className="timeline" ref={timelineRef}>
          <span className="track" aria-hidden="true" />
          <span className="fill" style={{ height: `${p * 100}%` }} aria-hidden="true" />

          <ol className="steps">
            {STEPS.map((s, i) => {
              const lit = p * STEPS.length > i + 0.15;
              return (
                <li key={s.n} className={`step${lit ? ' on' : ''}`}>
                  <span className="dot">
                    <i className="ring" />
                    <span>{s.n}</span>
                  </span>
                  <h3>{t(s.hKey)}</h3>
                  <p>{t(s.pKey)}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}