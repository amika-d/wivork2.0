import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global { interface Window { __lenis?: Lenis } }

/** Smooth scrolling for the whole page. Skipped under prefers-reduced-motion. */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    let raf = requestAnimationFrame(function tick(time) { lenis.raf(time); raf = requestAnimationFrame(tick); });
    // Same-page anchors go through Lenis so they glide instead of jumping.
    function onClick(event: MouseEvent) {
      const link = (event.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!link || link.origin !== location.origin || link.pathname !== location.pathname || !link.hash) return;
      const target = document.querySelector(link.hash);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement);
    }
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis; };
  }, []);
}
