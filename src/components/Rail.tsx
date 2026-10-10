import { useI18n } from '@/i18n/I18nProvider';
import { SECTION_IDS, RAIL_KEYS, type SectionId } from '@/data/sections';
import { scrollToId, type LenisRef } from '@/lib/scrollTo';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  active: SectionId;
  lenisRef: LenisRef;
}

export default function Rail({ active, lenisRef }: Props) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  // Step out of the way once the gold contact band is in view
  const hide = active === 'contact';

  return (
    <>
      <nav className={`rail${hide ? ' hide' : ''}`} aria-label="Sections">
        {SECTION_IDS.map((id, i) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? 'on' : undefined}
            aria-current={active === id ? 'true' : undefined}
            onClick={(e) => { e.preventDefault(); scrollToId(id, lenisRef, reduce); }}
          >
            <span>{t(RAIL_KEYS[i]!)}</span>
            <i />
          </a>
        ))}
      </nav>
    </>
  );
}