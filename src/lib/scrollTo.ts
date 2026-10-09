import type Lenis from 'lenis';

export type LenisRef = React.MutableRefObject<Lenis | null>;

export function scrollToEl(
  el: Element | null,
  lenisRef: LenisRef,
  reduce: boolean
): void {
  if (!el) return;

  const lenis = lenisRef.current;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: el.id === 'top' ? 0 : -72, duration: 1.2 });
    return;
  }

  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

export function scrollToId(
  id: string,
  lenisRef: LenisRef,
  reduce: boolean
): void {
  scrollToEl(document.getElementById(id), lenisRef, reduce);
}
