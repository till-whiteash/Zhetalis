import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { CHAPTERS } from '@/data/chapters';
import { useActiveSection } from '@/hooks/useActiveSelection';
import ServicesCanvas from './ServicesCanvas';
import { ArrowIcon } from './icons';

const SVC_IDS = ['svc-0', 'svc-1', 'svc-2'] as const;

export default function Services({ reduce }: { reduce: boolean }) {
  const { t } = useI18n();
  const active = useActiveSection(SVC_IDS, 0.55);
  const activeIdx = SVC_IDS.indexOf(active);
  const [animation, setAnimation] = useState({ shape: 1, activity: [0, 0, 0] });

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const viewport = window.innerHeight;
      let best = 0;
      let shape = 1;
      const activity = CHAPTERS.map((chapter, index) => {
        const el = document.getElementById(chapter.id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const height = Math.max(rect.height, viewport * 0.6);
        const distance = Math.abs(rect.top + rect.height / 2 - viewport / 2) / (height * 0.5);
        const amount = Math.max(0, Math.min(1, (1.1 - distance) / 0.55));
        if (amount > best) {
          best = amount;
          shape = index + 1;
        }
        return amount;
      });
      setAnimation((previous) => {
        const unchanged = previous.shape === shape
          && activity.every((value, index) => Math.abs(value - previous.activity[index]!) < 0.005);
        return unchanged ? previous : { shape, activity };
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="section" id="services">
      <div className="wrap">
        <div className="head svc-head-m">
          <p className="label">{t('svc.label')}</p>
          <h2 className="h2">{t('svc.h2')}</h2>
        </div>

        <div className="svc">
          <aside className="svc-aside">
            <div className="svc-head-d" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="label">{t('svc.label')}</p>
              <h2 className="h2">{t('svc.h2')}</h2>
            </div>
            <div className="svc-mark">
              <ServicesCanvas
                shape={animation.shape}
                activity={reduce ? [1, 1, 1] : animation.activity}
                reduce={reduce}
              />
            </div>
            <ol className="flow">
              {CHAPTERS.map((ch, i) => (
                <li key={ch.id} className={i === activeIdx ? 'on' : undefined}>
                  <a href={`#${ch.id}`}>
                    <span className="k">{String(i + 1).padStart(2, '0')}</span>
                    <span>{t(['m.consult', 'm.design', 'm.build'][i] as never)}</span>
                    <span className="bar" />
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="chapters">
            {CHAPTERS.map((ch) => (
              <Chapter key={ch.id} chapter={ch} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Chapter({ chapter }: { chapter: typeof CHAPTERS[number] }) {
  const { t } = useI18n();
  return (
    <article className="chapter" id={chapter.id}>
      <p className="label">{t(chapter.labelKey)}</p>
      <h3>{t(chapter.h3Key)}</h3>
      <p>{t(chapter.pKey)}</p>
      <ul className="hexlist">
        {chapter.items.map((k) => <li key={k}>{t(k)}</li>)}
      </ul>
      <a className="arrow-link" href="#contact">
        <span>{t(chapter.linkKey)}</span> <ArrowIcon className="ai" />
      </a>
    </article>
  );
}
