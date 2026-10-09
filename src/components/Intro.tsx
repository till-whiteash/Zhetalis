import { useEffect, useState } from 'react';
import logoMark from '@/assets/logo-mark.png';
import logoWord from '@/assets/logo-word.png';

const SEEN_KEY = 'zhetalis-intro';
const INTRO_DURATION_MS = 1900;

interface Props {
  onDone: () => void;
}

export default function Intro({ onDone }: Props) {
  const [visible, setVisible] = useState(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY) === '1') return false;
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch { /* ignore */ }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });

  useEffect(() => {
    if (!visible) {
      onDone();
      return;
    }
    const id = window.setTimeout(() => {
      setVisible(false);
      onDone();
    }, INTRO_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div className="intro" aria-hidden="true">
      <img className="intro-mark" src={logoMark} alt="" />
      <div className="intro-word">
        <img src={logoWord} alt="" />
      </div>
      <div className="intro-line"><i /></div>
    </div>
  );
}