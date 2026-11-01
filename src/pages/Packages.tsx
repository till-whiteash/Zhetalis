import { useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import Packages from '@/components/Packages';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';

export default function PackagesPage() {
  const { t } = useI18n();

  useEffect(() => {
    document.title = `${t('nav.packages')} · Zhetalis`;
    return () => { document.title = 'Zhetalis'; };
  }, [t]);

  return (
    <main className="page">
      <section className="wk-hero page-hero">
        <div className="wrap">
          <p className="label">{t('pk.label')}</p>
          <h1>{t('pg.pk.h1')}</h1>
          <p className="lede">{t('pg.pk.lede')}</p>
        </div>
      </section>
      <Packages />
      <Faq />
      <Contact />
    </main>
  );
}
