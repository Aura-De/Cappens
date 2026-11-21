'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { brand } from '@/lib/maquetas/content';
import { fullPieces, fullTextClip, markPieces } from './origami';
import { usePrefersReducedMotion } from './motion';
import mo from './motion.module.css';

type Play = 'mount' | 'inView' | 'loop' | 'static';

export type OrigamiLogoProps = {
  /** 'mark' = solo delfín; 'full' = delfín + "cappens" */
  variant?: 'mark' | 'full';
  /** cuándo se despliega: al montar, al entrar en pantalla, en bucle, o ya montado */
  play?: Play;
  /** retraso inicial en ms */
  delay?: number;
  /** duración total del despliegue en ms (el escalonado de la cola al hocico) */
  span?: number;
  className?: string;
  style?: CSSProperties;
  onAssembled?: () => void;
  /** reacciona al hover/tap con una onda de pliegues */
  interactive?: boolean;
  /** sombra de papel bajo el logo (solo para tamaños grandes) */
  shadow?: boolean;
};

/** Recorte del delfín completo (con hocico) sacado del logotipo. */
export const ORIGAMI_MARK_SRC = '/logo-cappens-origami-mark.png';

/**
 * Logo origami: el delfín se monta triángulo a triángulo, cada pieza se despliega sobre su
 * arista como una hoja de papel; después aparece el texto y un brillo recorre el papel.
 */
export function OrigamiLogo({
  variant = 'mark',
  play = 'mount',
  delay = 0,
  span = 1100,
  className,
  style,
  onAssembled,
  interactive = true,
  shadow = false,
}: OrigamiLogoProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(play === 'static');
  const layerRef = useRef<HTMLSpanElement | null>(null);
  const doneRef = useRef(onAssembled);
  doneRef.current = onAssembled;

  const src = variant === 'full' ? brand.logo.full : ORIGAMI_MARK_SRC;
  const pieces = variant === 'full' ? fullPieces : markPieces;
  // The last piece also needs its 1.1 s filter transition to finish.
  const total = delay + Math.max(span + 1100, variant === 'full' ? span * 0.75 + 900 : 0);

  // La imagen debe estar decodificada antes de desplegar (si no, las caras aparecen vacías)
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = src;
    const done = () => alive && setLoaded(true);
    (img.decode ? img.decode() : Promise.resolve()).then(done, done);
    return () => {
      alive = false;
    };
  }, [src]);

  // Disparadores
  useEffect(() => {
    if (!loaded) return;
    if (play === 'static' || reduced) {
      setOpen(true);
      return;
    }
    if (play === 'mount' || play === 'loop') {
      let secondFrame = 0;
      const firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => setOpen(true));
      });
      return () => {
        window.cancelAnimationFrame(firstFrame);
        window.cancelAnimationFrame(secondFrame);
      };
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOpen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [play, reduced, loaded]);

  // Aviso de montado + bucle
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => doneRef.current?.(), reduced ? 0 : total);
    let t2 = 0;
    if (play === 'loop' && !reduced) t2 = window.setTimeout(() => setOpen(false), total + 1800);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [open, play, reduced, total]);

  useEffect(() => {
    if (play !== 'loop' || open || reduced) return;
    const t = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(t);
  }, [open, play, reduced]);

  // Onda: se reinicia la animación en el mismo DOM (sin volver a montar imágenes, que parpadearían)
  const poke = () => {
    const layer = layerRef.current;
    if (!interactive || reduced || !open || !layer) return;
    layer.classList.remove(mo.oriRipple);
    void layer.offsetWidth;
    layer.classList.add(mo.oriRipple);
  };

  const cls = [
    mo.ori,
    variant === 'full' ? mo.oriFull : mo.oriMark,
    open ? mo.oriOpen : mo.oriFolded,
    reduced ? mo.oriReduced : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const face = (key: string | number, clip: string, vars: CSSProperties, cls: string) => (
    <span key={key} className={cls} style={{ clipPath: clip, WebkitClipPath: clip, ...vars }}>
      <img src={src} alt="" draggable={false} className={mo.oriImg} />
      <i className={mo.oriShade} />
      <i className={mo.oriGlint} />
    </span>
  );

  return (
    <span
      ref={ref}
      className={cls}
      style={{ ...style, '--span': `${span}ms`, '--delay': `${delay}ms` } as CSSProperties}
      role="img"
      aria-label={brand.fullName}
      onPointerEnter={poke}
      onClick={poke}
    >
      <img src={src} alt="" aria-hidden="true" className={mo.oriGhost} draggable={false} />
      {shadow && <span className={mo.oriShadow} aria-hidden="true" />}
      <span ref={layerRef} className={mo.oriLayer} aria-hidden="true">
        {pieces.map((p, i) =>
          face(
            i,
            p.poly,
            {
              '--ox': `${p.ox.toFixed(2)}%`,
              '--oy': `${p.oy.toFixed(2)}%`,
              '--ax': p.ax.toFixed(2),
              '--ay': p.ay.toFixed(2),
              '--o': p.order.toFixed(3),
              '--s': p.shade.toFixed(3),
            } as CSSProperties,
            mo.oriPiece,
          ),
        )}
        {variant === 'full' && face('t', fullTextClip, {}, mo.oriText)}
      </span>
    </span>
  );
}

/** Pantalla de carga: el logo se pliega en el centro y una cortina sube revelando la página. */
export function OrigamiPreloader({ onDone, onReveal, caption = 'Mini CRM a medida' }: { onDone?: () => void; onReveal?: () => void; caption?: string }) {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;
  const revealed = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    if (finished.current) return;
    const reveal = () => {
      if (revealed.current) return;
      revealed.current = true;
      revealRef.current?.();
    };
    if (reduced) {
      finished.current = true;
      reveal();
      setPhase('gone');
      doneRef.current?.();
      return;
    }
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    let released = false;
    const unlock = () => {
      if (released) return;
      released = true;
      root.style.overflow = previousOverflow;
    };
    root.style.overflow = 'hidden';
    const t1 = window.setTimeout(() => {
      reveal();
      setPhase('out');
    }, 2300);
    const t2 = window.setTimeout(() => {
      setPhase('gone');
      finished.current = true;
      unlock();
      doneRef.current?.();
    }, 3150);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      unlock();
    };
  }, [reduced]);

  if (phase === 'gone') return null;
  return (
    <div className={`${mo.pre} ${phase === 'out' ? mo.preOut : ''}`} aria-hidden="true">
      <div className={mo.preInner}>
        <OrigamiLogo variant="full" play="mount" delay={150} span={1000} interactive={false} shadow className={mo.preLogo} />
        <span className={mo.preCaption}>{caption}</span>
        <span className={mo.preBar} />
      </div>
    </div>
  );
}
