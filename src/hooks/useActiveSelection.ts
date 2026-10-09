import { useEffect, useState } from 'react';
export function useActiveSection<T extends string>(
  ids: readonly T[],
  threshold = 0.45
): T {
  const [active, setActive] = useState<T>(ids[0]!);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const cutoff = window.innerHeight * threshold;
      let cur: T = ids[0]!;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < cutoff) cur = id;
      }
      setActive((prev) => (prev === cur ? prev : cur));
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
  }, [ids, threshold]);

  return active;
}
