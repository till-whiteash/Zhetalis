import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { PROJECTS } from '@/data/work';
import Reveal from '@/components/Reveal';
import { ArrowIcon } from '@/components/icons';

/** Home-page strip of recent projects, linking to the full case studies on /work. */
export default function HomeWork() {
  const { t } = useI18n();

  return (
    <section className="section" id="work">
      <div className="wrap">
        <Reveal className="head">
          <p className="label">{t('ab.work.label')}</p>
          <h2 className="h2">{t('hw.h2')}</h2>
          <p className="lede">{t('hw.lede')}</p>
        </Reveal>
        <Reveal className="wk-teasers">
          {PROJECTS.map((p) => (
            <Link className="wk-teaser" key={p.id} to={`/work#${p.id}`}>
              <span className={`thumb ${p.cover.kind ?? 'photo'}`}>
                <img src={p.cover.src} width={p.cover.w} height={p.cover.h} alt="" loading="lazy" />
              </span>
              <span className="ev">{t(`${p.k}.for`)}</span>
              <b lang="en">{p.name}</b>
              <span>{t(`${p.k}.tag`)}</span>
              <span className="arrow-link"><span>{t('wk.read')}</span> <ArrowIcon className="ai" /></span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
