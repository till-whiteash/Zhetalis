import type { TranslationKey } from '@/i18n/translations';
import type { Currency, PackageKey } from './site';

/** One choice in the brief. `value` is what lands in the email (always English), `key` is what the visitor sees. */
export interface BriefOption {
  value: string;
  key: TranslationKey;
}

export type ServiceKey = PackageKey | 'unsure';

export const SERVICE_OPTIONS: readonly (BriefOption & { id: ServiceKey; descKey: TranslationKey })[] = [
  { id: 'consult', value: 'Consultation',    key: 'f.o0',     descKey: 'cp.o0d' },
  { id: 'design',  value: 'Design & Plan',   key: 'f.o1',     descKey: 'cp.o1d' },
  { id: 'build',   value: 'Build & Support', key: 'f.o2',     descKey: 'cp.o2d' },
  { id: 'unsure',  value: 'Not sure yet',    key: 'f.unsure', descKey: 'cp.o3d' },
];

export const TYPE_OPTIONS: readonly BriefOption[] = [
  { value: 'Website',                       key: 'cp.t0' },
  { value: 'Web app or portal',             key: 'cp.t1' },
  { value: 'Mobile app',                    key: 'cp.t2' },
  { value: 'Internal system or automation', key: 'cp.t3' },
  { value: 'IoT or hardware',               key: 'cp.t4' },
  { value: 'AI or data',                    key: 'cp.t5' },
  { value: 'Something else',                key: 'cp.t6' },
];

export const STAGE_OPTIONS: readonly BriefOption[] = [
  { value: 'Just an idea',              key: 'cp.g0' },
  { value: 'Planned, not started',      key: 'cp.g1' },
  { value: "Exists, but isn't working", key: 'cp.g2' },
  { value: 'Live and needs to grow',    key: 'cp.g3' },
];

export const TIMELINE_OPTIONS: readonly BriefOption[] = [
  { value: 'As soon as possible', key: 'cp.l0' },
  { value: 'Within 1-3 months',   key: 'cp.l1' },
  { value: '3-6 months',          key: 'cp.l2' },
  { value: 'Flexible',            key: 'cp.l3' },
];

/** Budget bands per currency. Numbers read the same in every language, so they aren't translated. */
export const BUDGETS: Record<Currency, readonly string[]> = {
  SGD: ['< 5k', '5k – 15k', '15k – 50k', '50k +'],
  TWD: ['< 120k', '120k – 350k', '350k – 1.2M', '1.2M +'],
  USD: ['< 4k', '4k – 11k', '11k – 37k', '37k +'],
};
export const BUDGET_UNSURE = 'Not sure yet';

export const CONTACT_OPTIONS: readonly (BriefOption | { value: string; label: string })[] = [
  { value: 'Email',      key: 'cp.c0' },
  { value: 'WhatsApp',   label: 'WhatsApp' },
  { value: 'LINE',       label: 'LINE' },
  { value: 'Phone call', key: 'cp.c3' },
  { value: 'Video call', key: 'cp.c4' },
];
/** Contact methods that only work if we have their number. */
export const NEEDS_PHONE = ['WhatsApp', 'LINE', 'Phone call'];

export const CALL_TIME_OPTIONS: readonly BriefOption[] = [
  { value: 'Mornings',   key: 'cp.w0' },
  { value: 'Afternoons', key: 'cp.w1' },
  { value: 'Evenings',   key: 'cp.w2' },
  { value: 'Any time',   key: 'cp.w3' },
];

/** Shown in their own script, so no translation needed. */
export const CALL_LANG_OPTIONS = [
  { value: 'English',  label: 'English', lang: 'en' },
  { value: 'Mandarin', label: '中文',     lang: 'zh' },
  { value: 'Hindi',    label: 'हिन्दी',   lang: 'hi' },
  { value: 'Arabic',   label: 'العربية',  lang: 'ar' },
] as const;

export interface Brief {
  service: string;
  types: string[];
  stage: string;
  message: string;
  timeline: string;
  currency: Currency;
  budget: string;
  links: string;
  name: string;
  email: string;
  company: string;
  role: string;
  contact: string;
  phone: string;
  callTime: string;
  callLang: string;
  source: string;
}

export const MESSAGE_MAX = 3000;
