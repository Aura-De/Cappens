'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

/** Se activa una sola vez cuando el elemento entra en pantalla (equivale a createEntryTrigger de GSAP). */
export function useInViewOnce<T extends Element>(
  threshold = 0.25,
  rootMargin = '0px 0px -10% 0px',
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold, rootMargin]);

  return [ref, seen];
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** Índice de la sección [data-scene] que ocupa el centro de la pantalla. */
export function useActiveScene(count: number): number {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const n = Number((e.target as HTMLElement).dataset.scene);
            if (!Number.isNaN(n)) setActive(Math.min(Math.max(n, 0), count - 1));
          }
        }
      },
      { rootMargin: '-38% 0px -58% 0px' }, // cambia de escena un poco antes de que la sección llegue al centro
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [count]);
  return active;
}

/** Dirección de scroll y si se ha pasado un umbral (para la cabecera que se oculta). */
export function useScrollDirection(threshold = 40): { scrolled: boolean; hidden: boolean } {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const goingDown = y > last;
        setState({ scrolled: y > threshold, hidden: goingDown && y > 240 });
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return state;
}

/** Activa scroll-snap en <html> solo mientras la maqueta está montada. */
export function useHtmlScrollSnap(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    const prevPad = html.style.scrollPaddingTop;
    html.style.scrollSnapType = 'y proximity';
    html.style.scrollPaddingTop = '0px';
    return () => {
      html.style.scrollSnapType = prevSnap;
      html.style.scrollPaddingTop = prevPad;
    };
  }, [enabled]);
}
