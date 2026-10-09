import type { TranslationKey } from '@/i18n/translations';

export interface Step {
  n: string;
  hKey: TranslationKey;
  pKey: TranslationKey;
  items: readonly TranslationKey[];
}

export const STEPS: readonly Step[] = [
  { n: '01', hKey: 'st0.h', pKey: 'st0.p', items: ['st0.i0', 'st0.i1'] },
  { n: '02', hKey: 'st1.h', pKey: 'st1.p', items: ['st1.i0', 'st1.i1'] },
  { n: '03', hKey: 'st2.h', pKey: 'st2.p', items: ['st2.i0', 'st2.i1'] },
  { n: '04', hKey: 'st3.h', pKey: 'st3.p', items: ['st3.i0', 'st3.i1'] },
];