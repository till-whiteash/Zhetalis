import type { SectionId } from '@/data/sections';
import type { LenisRef } from '@/lib/scrollTo';

import Rail from '@/components/Rail';
import Hero from '@/components/Hero';
import Finder from '@/components/Finder';
import Manifesto from '@/components/Manifesto';
import Services from '@/components/Services';
import Approach from '@/components/Approach';
import Packages from '@/components/Packages';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';

interface Props {
  active: SectionId;
  lenisRef: LenisRef;
  reduce: boolean;
}

export default function Home({ active, lenisRef, reduce }: Props) {
  return (
    <>
      <Rail active={active} lenisRef={lenisRef} />
      <main>
        <Hero lenisRef={lenisRef} reduce={reduce} />
        <Finder />
        <Manifesto />
        <Services reduce={reduce} />
        <Approach />
        <Packages />
        <Faq />
        <Contact />
      </main>
    </>
  );
}
