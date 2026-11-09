import { useEffect, useRef, useState } from 'react';

export function useInView<T extends Element>(
  options?: IntersectionObserverInit
): readonly [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      const e = entries[0];
      if (e?.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView] as const;
}
