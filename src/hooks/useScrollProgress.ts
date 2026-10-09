import { useEffect, useState, type RefObject } from 'react';

interface Options {
  /** fraction of viewport height above which progress is 0 */
  start?: number;
  /** extra viewport height below, extending the end of the range */
  end?: number;
}

export function useScrollProgress(
  ref: RefObject<Element | null>,
  { start = 0.85, end = 0.35 }: Options = {}
): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * end;
      const raw = (vh * start - r.top) / (total || 1);
      setP((prev) => {
        const next = Math.max(0, Math.min(1, raw));
        return Math.abs(next - prev) < 0.001 ? prev : next;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, start, end]);

  return p;
}