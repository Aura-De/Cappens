'use client';

// Primitivas de movimiento compartidas por las maquetas (equivalentes a lo que necora.pro hace con framer-motion):
// - Reveal: entra con desenfoque + desplazamiento y SE REPITE al salir/entrar (viewport once:false)
// - Words: titular palabra a palabra (scale .86 + blur 22px, escalonado)
// - useScrollProgress: progreso 0..1 de una sección sticky suavizado con muelle (stiffness 92, damping 24, mass .72)
// - useCountUp, useMouseMask, useInView, usePrefersReducedMotion
// Sin dependencias. Easing de Necora: cubic-bezier(.16,1,.3,1).

import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from 'react';
import mo from './motion.module.css';

export const EASE = 'cubic-bezier(.16,1,.3,1)';

/** La web siempre se anima, también con «reducir movimiento» en el sistema. */
export function usePrefersReducedMotion() {
  return false;
}

/** true mientras el elemento está visible (amount = fracción visible necesaria). Con once, se queda en true. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { amount = 0.35, once = false, margin = '0px' }: { amount?: number; once?: boolean; margin?: string } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    let io: IntersectionObserver | undefined;
    let threshold = -1;
    let done = false;
    const observe = () => {
      if (done) return;
      const rect = el.getBoundingClientRect();
      // A tall form/CRM must still be able to enter on a short viewport.
      const possible = Math.min(1, window.innerHeight / Math.max(1, rect.height)) * Math.min(1, window.innerWidth / Math.max(1, rect.width));
      const requested = Number.isFinite(amount) ? Math.min(1, Math.max(0, amount)) : 0.35;
      const next = requested <= possible ? requested : possible * 0.9;
      if (io && next === threshold) return;
      threshold = next;
      io?.disconnect();
      io = new IntersectionObserver(([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio + 0.000001 >= threshold;
        if (visible) {
          setInView(true);
          if (once) { done = true; io?.disconnect(); }
        } else if (!once) setInView(false);
      }, { threshold: [...new Set([0, threshold])], rootMargin: margin });
      io.observe(el);
    };
    observe();
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(observe) : undefined;
    resize?.observe(el);
    window.addEventListener('resize', observe);
    return () => { io?.disconnect(); resize?.disconnect(); window.removeEventListener('resize', observe); };
  }, [ref, amount, once, margin]);
  return inView;
}

type From = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

type RevealProps = {
  children?: ReactNode;
  from?: From;
  /** segundos */
  delay?: number;
  /** segundos */
  duration?: number;
  /** fracción visible para disparar */
  amount?: number;
  /** false (por defecto, como Necora) = se repite al volver a entrar */
  once?: boolean;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** Revelado con desenfoque y desplazamiento. Usa `overflow-x: clip` en la sección si usas left/right. */
export function Reveal({
  children,
  from = 'up',
  delay = 0,
  duration = 0.88,
  amount = 0.3,
  once = false,
  as = 'div',
  className,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount, once });
  return createElement(
    as,
    {
      ref,
      id,
      className: [mo.rv, mo[`rv_${from}`], inView ? mo.rvIn : '', className].filter(Boolean).join(' '),
      style: { ...style, '--rv-delay': `${delay}s`, '--rv-dur': `${duration}s` } as CSSProperties,
    },
    children,
  );
}

type WordsProps = {
  text: string | readonly string[];
  as?: ElementType;
  className?: string;
  /** segundos entre palabras */
  stagger?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  /** 'blur' (Necora: scale .86 + blur) o 'rise' (máscara que sube) */
  effect?: 'blur' | 'rise';
  style?: CSSProperties;
};

/** Titular que aparece palabra a palabra. Si `text` es un array, cada elemento es una línea. */
export function Words({
  text,
  as = 'h2',
  className,
  stagger = 0.07,
  delay = 0,
  once = false,
  amount = 0.5,
  effect = 'blur',
  style,
}: WordsProps) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount, once });
  const lines = typeof text === 'string' ? [text] : text;
  let i = 0;
  const label = lines.join(' ');
  return createElement(
    as,
    {
      ref,
      className: [mo.moWords, effect === 'rise' ? mo.moWordsRise : mo.moWordsBlur, inView ? mo.moWordsIn : '', className]
        .filter(Boolean)
        .join(' '),
      style,
      'aria-label': label,
    },
    lines.map((line, li) => (
      <span key={li} className={mo.moWordsLine} aria-hidden="true">
        {line.split(/\s+/).filter(Boolean).map((w, wi) => {
          const idx = i++;
          return (
            <Fragment key={wi}>
              <span className={mo.moWordMask}>
                <span className={mo.moWord} style={{ '--wd': `${delay + idx * stagger}s` } as CSSProperties}>
                  {w}
                </span>
              </span>{' '}
            </Fragment>
          );
        })}
      </span>
    )),
  );
}

/**
 * Progreso 0..1 de una sección alta con contenido sticky: 0 cuando su borde superior toca el de la ventana,
 * 1 cuando su borde inferior toca el inferior de la ventana (offset ["start start","end end"]).
 * Con `spring` se suaviza como useSpring de framer-motion (stiffness 92, damping 24, mass .72).
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { spring = true, stiffness = 92, damping = 24, mass = 0.72, enabled = true } = {},
) {
  const [value, setValue] = useState(0);
  const latest = useRef(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!enabled) { latest.current = 0; setValue(0); return; }
    let target = 0;
    let x = latest.current;
    let v = 0;
    let raf = 0;
    let last = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const range = r.height - window.innerHeight;
      target = range <= 0 ? (r.top <= 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / range));
    };
    const tick = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60);
      last = t;
      if (!spring || reduced) {
        x = target;
        v = 0;
      } else {
        const f = -stiffness * (x - target) - damping * v;
        v += (f / mass) * dt;
        x += v * dt;
      }
      latest.current = Math.min(1, Math.max(0, x));
      setValue(latest.current);
      if (Math.abs(x - target) > 0.0005 || Math.abs(v) > 0.0005) raf = window.requestAnimationFrame(tick);
      else {
        x = target;
        latest.current = x;
        setValue(x);
        raf = 0;
        last = 0;
      }
    };
    const onScroll = () => {
      measure();
      if (!raf) raf = window.requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onScroll) : undefined;
    resize?.observe(el);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resize?.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [ref, spring, stiffness, damping, mass, reduced, enabled]);
  return value;
}

/** Interpola: mapea v de [a,b] a [0,1] con clamp. */
export const range = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
/** smoothstep */
export const smooth = (t: number) => t * t * (3 - 2 * t);

/** Cuenta de 0 a `to` cuando `active` pasa a true. */
export function useCountUp(to: number, active: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (!Number.isFinite(ms) || ms <= 0) { setN(to); return; }
    const duration = reduced ? Math.min(ms, 90) : ms;
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, active, ms, reduced]);
  return n;
}

/** Escribe --mask-x / --mask-y (en %) sobre el elemento siguiendo al puntero (revelado radial del hero de Necora). */
export function useMouseMask<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [active, setActive] = useState(false);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 52;
    let ty = 42;
    let x = 52;
    let y = 42;
    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.setProperty('--mask-x', `${x.toFixed(2)}%`);
      el.style.setProperty('--mask-y', `${y.toFixed(2)}%`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
      ty = Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100));
      if (reduced) {
        x = tx; y = ty;
        el.style.setProperty('--mask-x', `${x}%`);
        el.style.setProperty('--mask-y', `${y}%`);
      } else if (!raf) raf = requestAnimationFrame(loop);
    };
    const enter = (e: PointerEvent) => { if (e.pointerType !== 'touch') setActive(true); };
    const leave = () => setActive(false);
    const down = (e: PointerEvent) => {
      move(e);
      enter(e);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', down);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointerdown', down);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, reduced]);
  return [active, setActive] as const;
}

/** Parallax suave: devuelve un desplazamiento en px según la posición del elemento en la ventana. */
export function useParallax<T extends HTMLElement>(ref: RefObject<T | null>, strength = 60) {
  const [y, setY] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) { setY(0); return; }
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const c = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        setY(-c * strength);
      });
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, strength, reduced]);
  return y;
}

/**
 * Scroll suave con inercia para rueda de ratón/trackpad (equivalente ligero a Lenis, que usan andromeda y lobera).
 * En táctil no hace nada (el scroll nativo ya tiene inercia). Respeta "reducir movimiento".
 */
export function useSmoothScroll({ lerp = 0.1, enabled = true }: { lerp?: number; enabled?: boolean } = {}) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!enabled || reduced || typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let animating = false;
    const factor = Number.isFinite(lerp) && lerp > 0 && lerp <= 1 ? lerp : 0.1;
    const max = () => Math.max(0, root.scrollHeight - window.innerHeight);
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      animating = false;
      current = window.scrollY;
      target = current;
      root.style.scrollBehavior = prevBehavior;
    };
    const loop = () => {
      if (root.style.overflow === 'hidden' || document.body.style.overflow === 'hidden') { stop(); return; }
      target = Math.min(max(), target);
      current += (target - current) * factor;
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo(0, current);
      if (current !== target) raf = requestAnimationFrame(loop);
      else {
        animating = false;
        raf = 0;
        root.style.scrollBehavior = prevBehavior;
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || !e.deltaY || e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // deja pasar la rueda a elementos con scroll propio (carruseles, modales, kanban)
      let el = e.target instanceof Element ? e.target : null;
      while (el && el !== document.body) {
        const st = getComputedStyle(el);
        if (/(auto|scroll)/.test(st.overflowY) && el.scrollHeight > el.clientHeight + 1) return;
        if (e.deltaX && /(auto|scroll)/.test(st.overflowX) && el.scrollWidth > el.clientWidth + 1) return;
        el = el.parentElement;
      }
      if (document.documentElement.style.overflow === 'hidden' || document.body.style.overflow === 'hidden') return;
      e.preventDefault();
      if (!animating) {
        current = window.scrollY;
        target = current;
        root.style.scrollBehavior = 'auto';
      }
      const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      target = Math.max(0, Math.min(max(), target + delta));
      animating = true;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      // Keyboard, anchors, scrollIntoView and scrollbar drags take priority over inertia.
      if (animating && Math.abs(window.scrollY - current) > 2) { stop(); return; }
      if (!animating) {
        current = window.scrollY;
        target = current;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', onKeyDown);
      stop();
    };
  }, [lerp, enabled, reduced]);
}
