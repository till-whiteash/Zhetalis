import type { TranslationKey } from '@/i18n/translations';
import type { PackageKey } from './site';

export interface Package {
  key: PackageKey;
  tagKey: TranslationKey;
  hKey: TranslationKey;
  pKey: TranslationKey;
  items: readonly TranslationKey[];
  btnKey: TranslationKey;
}

export const PACKAGES: readonly Package[] = [
  {
    key: 'consult',
    tagKey: 'pk0.tag',
    hKey: 'pk0.h',
    pKey: 'pk0.p',
    items: ['pk0.i0', 'pk0.i1', 'pk0.i2'],
    btnKey: 'pk0.btn',
  },
  {
    key: 'design',
    tagKey: 'pk1.tag',
    hKey: 'pk1.h',
    pKey: 'pk1.p',
    items: ['pk1.i0', 'pk1.i1', 'pk1.i2'],
    btnKey: 'pk1.btn',
  },
  {
    key: 'build',
    tagKey: 'pk2.tag',
    hKey: 'pk2.h',
    pKey: 'pk2.p',
    items: ['pk2.i0', 'pk2.i1', 'pk2.i2'],
    btnKey: 'pk2.btn',
  },
];