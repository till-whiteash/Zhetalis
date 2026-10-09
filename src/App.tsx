import { useCallback, useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useActiveSection } from '@/hooks/useActiveSelection';
import { SECTION_IDS, type SectionId } from '@/data/sections';

import Intro from '@/components/Intro';
import Header from '@/components/Header';
import Rail from '@/components/Rail';
import Hero from '@/components/Hero';
import Finder from '@/components/Finder';
import Manifesto from '@/components/Manifesto';
import Services from '@/components/Services';
import Approach from '@/components/Approach';
import Packages from '@/components/Packages';
import Faq from '@/components/Faq';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export default function App() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const smooth = !reduce && finePointer;

  const lenisRef = useLenis(smooth);
  const [introDone, setIntroDone] = useState(reduce);
  const [preselect, setPreselect] = useState<string | null>(null);

  // Pause Lenis while the intro overlay is up
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (introDone) lenis.start();
    else lenis.stop();
  }, [introDone, lenisRef]);

  // Tell the rest of the page to wait for the intro
  useEffect(() => {
    document.documentElement.style.setProperty('--intro', introDone ? '0s' : '1.1s');
  }, [introDone]);

  const onIntroDone = useCallback(() => setIntroDone(true), []);

  const onPickPackage = useCallback((serviceId: string) => {
    setPreselect(serviceId);
    const el = document.getElementById('contact');
    const lenis = lenisRef.current;
    if (lenis && el) lenis.scrollTo(el, { offset: -72, duration: 1.2 });
    else el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    }, reduce ? 0 : 900);
  }, [lenisRef, reduce]);

  const active: SectionId = useActiveSection(SECTION_IDS);

  return (
    <>
      <Intro onDone={onIntroDone} />
      <Header active={active} lenisRef={lenisRef} />
      <Rail active={active} lenisRef={lenisRef} />

      <main>
        <Hero lenisRef={lenisRef} reduce={reduce} />
        <Finder />
        <Manifesto />
        <Services reduce={reduce} />
        <Approach />
        <Packages onPickPackage={onPickPackage} />
        <Faq />
        <Contact preselect={preselect} />
      </main>

      <Footer lenisRef={lenisRef} />
      <FloatingButtons />
    </>
  );
}