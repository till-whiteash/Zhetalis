import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { useInView } from '@/hooks/useInView';
import { ArrowIcon } from './icons';
import { contactPath } from '@/lib/useSectionNav';

const INDICES = [0, 1, 2, 3] as const;
type FinderIndex = (typeof INDICES)[number];

const LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function Finder() {
  const { t } = useI18n();
  const [active, setActive] = useState<FinderIndex>(0);
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '0px 0px -10% 0px' });

  const key = `a${active}` as const;
  // A and C explain the matching service; B (student coaching) and D go straight to the brief
  const LINKS = ['/services#svc-0', contactPath(), '/services#svc-2', contactPath('consult')] as const;
  const linkTo = LINKS[active];

  return (
    <section className="section" id="find">
      <div className="wrap">
        <div className={`head${inView ? ' in' : ' armed'}`}>
          <p className="label">{t('find.label')}</p>
          <h2 className="h2">{t('find.h2')}</h2>
          <p className="lede">{t('find.lede')}</p>
        </div>

        <div className="finder" ref={ref}>
          <div className="rows" role="group">
            {INDICES.map((i) => (
              <button
                key={i}
                className="row-btn"
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <span className="k">{LETTERS[i]}</span>
                <span>{t(`find.q${i}`)}</span>
                <ArrowIcon size={20} className="ai" />
              </button>
            ))}
          </div>

          <div className="answer" key={active} aria-live="polite">
            <p className="label">{t(`${key}.tag`)}</p>
            <h3>{t(`${key}.title`)}</h3>
            <p>{t(`${key}.body`)}</p>
            <Link className="arrow-link" to={linkTo}>
              {t(`${key}.link`)} <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
