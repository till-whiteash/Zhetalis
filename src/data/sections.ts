export const SECTION_IDS = [
  'top',
  'find',
  'work',
  'contact',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const RAIL_KEYS = [
  'rail.intro',
  'rail.find',
  'nav.work',
  'rail.contact',
] as const;
