import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToId, type LenisRef } from './scrollTo';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Returns a click handler for links to home-page sections.
 * On the home page it scrolls smoothly; on any other page it routes to `/#id`
 * and the home page scrolls there once it has rendered (see App).
 */
export function useSectionNav(lenisRef: LenisRef) {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/';

  const go = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onHome) scrollToId(id, lenisRef, reduce);
    else navigate(id === 'top' ? '/' : `/#${id}`);
  }, [onHome, lenisRef, reduce, navigate]);

  /** The href to put on the link, so middle-click and "open in new tab" still work. */
  const href = (id: string) => (onHome ? `#${id}` : id === 'top' ? '/' : `/#${id}`);

  return { go, href, onHome };
}

/** Link target for the contact page, optionally with a service preselected. */
export function contactPath(service?: string): string {
  return service ? `/contact?service=${encodeURIComponent(service)}` : '/contact';
}
