export const CURRENCIES = ['SGD', 'TWD', 'USD'] as const;
export type Currency = (typeof CURRENCIES)[number];

export const PACKAGE_KEYS = ['consult', 'design', 'build'] as const;
export type PackageKey = (typeof PACKAGE_KEYS)[number];

interface SiteConfig {
  phone: string;
  whatsapp: string;
  phoneTW: string;
  line: string;
  email: string;
  booking: string;
  currencies: readonly Currency[];
  prices: Record<PackageKey, Record<Currency, number | ''>>;
}

export const SITE: SiteConfig = {
  phone: '+65 9130 0969',
  whatsapp: '6591300969',
  phoneTW: '+886 912 408 256',
  line: '',
  email: 'Htaittinye@zhetalis.com',
  booking: '',
  currencies: CURRENCIES,
  prices: {
    consult: { SGD: '', TWD: '', USD: '' },
    design:  { SGD: '', TWD: '', USD: '' },
    build:   { SGD: '', TWD: '', USD: '' },
  },
};