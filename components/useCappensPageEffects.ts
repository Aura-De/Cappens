'use client';

import { useEffect, useRef } from 'react';
import { setupLayerStack } from '@/components/setupLayerStack';

type CappensPageEffectsOptions = {
  menuLabels?: { open: string; close: string };
  /** Re-run listeners when static markup is swapped (e.g. locale change). */
  locale?: string;
};

export function useCappensPageEffects(options?: CappensPageEffectsOptions) {
  const locale = options?.locale ?? 'es';
  const menuLabelsRef = useRef(options?.menuLabels);
  menuLabelsRef.current = options?.menuLabels;

  useEffect(() => {
    const nav = document.getElementById('nav');
    const btn = document.getElementById('menuBtn');
    const bar = document.getElementById('progress');
    if (!nav || !btn || !bar) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const teardownLayers = setupLayerStack(reduce);

    const onScroll = () => {
      const y = window.scrollY || 0;
      nav.classList.toggle('small', y > 24);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const setMenu = (open: boolean) => {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      const labels = menuLabelsRef.current;
      const closeLabel = labels?.close ?? 'Cerrar menú';
      const openLabel = labels?.open ?? 'Abrir menú';
      btn.setAttribute('aria-label', open ? closeLabel : openLabel);
    };

    const onMenuClick = () => setMenu(!nav.classList.contains('open'));
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(false);
    };
    const drawerLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.drawer a'));
    const onDrawerLinkClick = () => setMenu(false);
    const onResize = () => {
      if (window.innerWidth > 760) setMenu(false);
    };

    btn.addEventListener('click', onMenuClick);
    document.addEventListener('keydown', onKeydown);
    drawerLinks.forEach((a) => a.addEventListener('click', onDrawerLinkClick));
    window.addEventListener('resize', onResize);

    let revealIo: IntersectionObserver | undefined;
    if (!reduce && 'IntersectionObserver' in window) {
      revealIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.remove('pre');
              revealIo?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
          el.classList.add('pre');
          revealIo?.observe(el);
        }
      });
    }

    let spy: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      const links = Array.from(
        document.querySelectorAll<HTMLAnchorElement>('.links a, .drawer a')
      );
      const secs = ['servicios', 'metodo']
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            links.forEach((a) => {
              a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`);
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      secs.forEach((s) => spy?.observe(s));
    }

    const stage = document.getElementById('stage');
    const fold = document.getElementById('fold');
    const onPointerMove = (e: PointerEvent) => {
      const mx = (e.clientX / window.innerWidth - 0.5) * 2;
      const my = (e.clientY / window.innerHeight - 0.5) * 2;
      fold?.style.setProperty('--mx', mx.toFixed(3));
      fold?.style.setProperty('--my', my.toFixed(3));
    };

    if (!reduce && stage && fold && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    setMenu(false);

    return () => {
      teardownLayers?.();
      if (btn.isConnected) btn.removeEventListener('click', onMenuClick);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKeydown);
      drawerLinks.forEach((a) => {
        if (a.isConnected) a.removeEventListener('click', onDrawerLinkClick);
      });
      window.removeEventListener('resize', onResize);
      revealIo?.disconnect();
      spy?.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [locale]);
}
