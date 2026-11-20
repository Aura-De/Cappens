'use client';

import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useParallax, usePrefersReducedMotion } from '@/app/maquetas/_motion/motion';
import styles from '../andromeda.module.css';

/** Capa con parallax (hero / media de tarjetas). */
export function AnParallax({
  children,
  strength = 48,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const y = useParallax(ref, reduced ? 0 : strength);
  return (
    <div
      ref={ref}
      className={`${styles.anParallax} ${className ?? ''}`.trim()}
      style={{ ['--an-py' as string]: `${y}px` }}
    >
      {children}
    </div>
  );
}

type MagnetAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  strength?: number;
};

/** CTA magnético: el botón se desplaza un poco hacia el cursor. */
export function AnMagnetLink({ children, className, strength = 0.28, ...rest }: MagnetAnchorProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced || !fine) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  return (
    <a
      {...rest}
      ref={ref}
      className={`${styles.anMagnet} ${className ?? ''}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </a>
  );
}

type MagnetButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
};

export function AnMagnetButton({ children, className, strength = 0.28, ...rest }: MagnetButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduced || !fine) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  return (
    <button
      {...rest}
      ref={ref}
      className={`${styles.anMagnet} ${className ?? ''}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </button>
  );
}

/** Línea de progreso de scroll fija arriba. */
export function AnScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div
      className={styles.anProgress}
      aria-hidden="true"
      style={{ ['--an-progress' as string]: String(p) } as CSSProperties}
    />
  );
}

/** Cursor circular sutil: solo pointer fine; crece sobre enlaces/botones. */
export function AnCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, grow: false });

  useEffect(() => {
    if (reduced || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = dot.current;
    if (!el) return;
    let raf = 0;
    document.documentElement.classList.add(styles.anCursorRoot);

    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.22;
      p.y += (p.ty - p.y) * 0.22;
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
      el.dataset.grow = p.grow ? '1' : '0';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      pos.current.grow = Boolean(t.closest('a, button, [role="button"], summary, input, textarea, label'));
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      document.documentElement.classList.remove(styles.anCursorRoot);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <div ref={dot} className={styles.anCursor} aria-hidden="true" />;
}
