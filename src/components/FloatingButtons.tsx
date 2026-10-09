import { useI18n } from '@/i18n/I18nProvider';
import { SITE } from '@/data/site';
import { WhatsAppIcon, LineIcon } from './icons';

export default function FloatingButtons() {
  const { t } = useI18n();

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('ct.waMsg'))}`;
  const lineHref = SITE.line
    ? SITE.line.startsWith('@')
      ? `https://line.me/R/ti/p/%40${encodeURIComponent(SITE.line.slice(1))}`
      : `https://line.me/ti/p/~${encodeURIComponent(SITE.line)}`
    : '';

  const copyLine = async () => {
    try {
      await navigator.clipboard.writeText(SITE.phoneTW);
    } catch { /* ignore */ }
  };

  return (
    <>
      <a className="wa-float" href={waHref} target="_blank" rel="noopener" aria-label="WhatsApp">
        <WhatsAppIcon size={26} />
      </a>
      {lineHref ? (
        <a className="wa-float line-float" href={lineHref} target="_blank" rel="noopener" aria-label="LINE">
          <LineIcon size={26} />
        </a>
      ) : (
        <button
          className="wa-float line-float"
          type="button"
          aria-label="LINE"
          onClick={copyLine}
        >
          <LineIcon size={26} />
        </button>
      )}
    </>
  );
}
