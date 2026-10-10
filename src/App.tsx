import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useActiveSection } from '@/hooks/useActiveSelection';
import { SECTION_IDS, type SectionId } from '@/data/sections';

import Intro from '@/components/Intro';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import Home from '@/pages/Home';
import ContactPage from '@/pages/Contact';
import AboutPage from '@/pages/About';
import WorkPage from '@/pages/Work';

export default function App() {
  const reduce = useReducedMotion();
  const finePointer = useMediaQuery('(pointer: fine)');
  const smooth = !reduce && finePointer;

  const lenisRef = useLenis(smooth);
  const { pathname, hash } = useLocation();
  const onHome = pathname === '/';

  // The intro overlay only plays on the home page
  // ...and only when the visit starts there, not when coming back from /contact
  const [introAllowed] = useState(onHome);
  const [introSeen, setIntroDone] = useState(reduce || !onHome);
  const introDone = introSeen || !onHome;

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

  // Changing page: land on the section in the hash (e.g. /#services from the contact page), else at the top
  useEffect(() => {
    const lenis = lenisRef.current;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const timer = window.setTimeout(() => {
        const el = document.getElementById(id);
        if (!el) return;
        if (lenis) {
          lenis.resize(); // the new page is taller than the one we came from
          lenis.scrollTo(el, { offset: id === 'top' ? 0 : -72, immediate: true, force: true });
        }
        else el.scrollIntoView();
      }, 60);
      return () => window.clearTimeout(timer);
    }
    if (lenis) { lenis.resize(); lenis.scrollTo(0, { immediate: true, force: true }); }
    window.scrollTo(0, 0);
  }, [pathname, hash, lenisRef]);

  const onIntroDone = useCallback(() => setIntroDone(true), []);
  const active: SectionId = useActiveSection(SECTION_IDS);

  return (
    <>
      {onHome && introAllowed && <Intro onDone={onIntroDone} />}
      <Header active={onHome ? active : null} lenisRef={lenisRef} />

      <Routes>
        <Route path="/" element={<Home active={active} lenisRef={lenisRef} reduce={reduce} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer lenisRef={lenisRef} />
      <FloatingButtons />
    </>
  );
}
