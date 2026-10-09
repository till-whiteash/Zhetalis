export const SECTION_IDS = [
  'top',
  'find',
  'services',
  'approach',
  'packages',
  'faq',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const RAIL_KEYS = [
  'rail.intro',
  'rail.find',
  'nav.services',
  'nav.approach',
  'nav.packages',
  'nav.faq',
  'rail.contact',
] as const;