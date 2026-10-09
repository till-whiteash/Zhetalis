import type { TranslationKey } from '@/i18n/translations';

export interface Chapter {
  id: string;
  labelKey: TranslationKey;
  h3Key: TranslationKey;
  pKey: TranslationKey;
  items: readonly TranslationKey[];
  linkKey: TranslationKey;
}

export const CHAPTERS: readonly Chapter[] = [
  {
    id: 'svc-0',
    labelKey: 'svc0.label',
    h3Key: 'svc0.h3',
    pKey: 'svc0.p',
    items: ['svc0.i0', 'svc0.i1', 'svc0.i2', 'svc0.i3'],
    linkKey: 'svc0.link',
  },
  {
    id: 'svc-1',
    labelKey: 'svc1.label',
    h3Key: 'svc1.h3',
    pKey: 'svc1.p',
    items: ['svc1.i0', 'svc1.i1', 'svc1.i2', 'svc1.i3'],
    linkKey: 'svc1.link',
  },
  {
    id: 'svc-2',
    labelKey: 'svc2.label',
    h3Key: 'svc2.h3',
    pKey: 'svc2.p',
    items: ['svc2.i0', 'svc2.i1', 'svc2.i2', 'svc2.i3'],
    linkKey: 'svc2.link',
  },
];