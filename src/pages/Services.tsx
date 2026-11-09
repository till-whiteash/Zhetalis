import { useI18n } from '@/i18n/I18nProvider';
import Services from '@/components/Services';
import Approach from '@/components/Approach';
import Contact from '@/components/Contact';

export default function ServicesPage({ reduce }: { reduce: boolean }) {
  const { t } = useI18n();

  return (
    <main className="page">
      <section className="wk-hero page-hero">
        <div className="wrap">
          <p className="label">{t('svc.label')}</p>
          <h1>{t('pg.svc.h1')}</h1>
          <p className="lede">{t('pg.svc.lede')}</p>
        </div>
      </section>
      <Services reduce={reduce} />
      <Approach />
      <Contact />
    </main>
  );
}
