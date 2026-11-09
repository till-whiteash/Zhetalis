export const ORIGIN = 'https://zhetalis.com';

export const PAGES = [
  { path: '/', title: 'Zhetalis | Software, AI & Connected Systems', description: 'Zhetalis plans, designs and builds software, AI and connected systems for businesses, with a team in Singapore and Kaohsiung, Taiwan.' },
  { path: '/services/', title: 'Software, AI & IoT Development Services | Zhetalis', description: 'Explore Zhetalis services: business consulting, system design, web and mobile development, AI features and connected IoT systems.' },
  { path: '/packages/', title: 'Consulting, Design & Development Packages | Zhetalis', description: 'Find the right starting point for your project with Zhetalis consulting, system design and development packages. Discuss your scope with our team.' },
  { path: '/work/', title: 'Our Work & Engineering Projects | Zhetalis', description: 'Explore Zhetalis projects in software, healthcare and connected systems, including StoreFlow, Shifa and rail anomaly detection.' },
  { path: '/about/', title: 'About Our Engineering Team | Zhetalis', description: 'Meet Zhetalis, a software and engineering team based in Singapore and Kaohsiung, Taiwan, building practical software, AI and connected systems.' },
  { path: '/contact/', title: 'Contact Zhetalis | Discuss Your Project', description: 'Discuss your software, AI or connected systems project with Zhetalis. Contact our team in Singapore and Taiwan or prepare a project brief.' },
] as const;

export function pageFor(pathname: string) {
  const normalized = `/${pathname.split('/').filter(Boolean).join('/')}/`.replace('//', '/');
  return PAGES.find(page => page.path === normalized);
}

export const organization = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': `${ORIGIN}/#organization`,
      name: 'Zhetalis', url: `${ORIGIN}/`,
      logo: { '@type': 'ImageObject', url: `${ORIGIN}/zhetalis-logo.png`, width: 512, height: 512 },
      description: PAGES[0].description,
    },
    {
      '@type': 'WebSite', '@id': `${ORIGIN}/#website`,
      name: 'Zhetalis', url: `${ORIGIN}/`,
      publisher: { '@id': `${ORIGIN}/#organization` },
    },
  ],
};
