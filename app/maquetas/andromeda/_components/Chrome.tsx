'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { brand, nav } from '@/lib/maquetas/content';
import styles from '../andromeda.module.css';
import { useScrollDirection } from './hooks';
import { OrigamiLogo } from '../../_motion/OrigamiLogo';
import { AnMagnetLink } from './MotionExtras';

/* ---------- Splash: logo que aparece y cortina que sube (≈ mwm-splash-screen) ---------- */
export function Splash({ reduced, onDone }: { reduced: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');

  useEffect(() => {
    if (reduced) {
      setPhase('gone');
      onDone();
      return;
    }
    const t1 = window.setTimeout(() => setPhase('out'), 2300);
    const t2 = window.setTimeout(() => {
      setPhase('gone');
      onDone();
    }, 3100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [reduced, onDone]);

  if (phase === 'gone') return null;
  return (
    <div className={`${styles.splash} ${phase === 'out' ? styles.splashOut : ''}`} aria-hidden="true">
      <OrigamiLogo variant="full" play="mount" delay={120} span={1000} interactive={false} className={styles.splashLogo} />
      <span className={styles.splashBar} />
    </div>
  );
}

/* ---------- Fondo fijo que cambia por sección (≈ gl-background-system con gl-transitions) ---------- */
const SCENES = ['sceneHero', 'sceneStatement', 'sceneAreas', 'sceneProjects', 'sceneProcess', 'sceneContact'] as const;
export const SCENE_COUNT = SCENES.length;

export function SceneBackground({ active }: { active: number }) {
  const [prev, setPrev] = useState(active);
  const [current, setCurrent] = useState(active);

  useEffect(() => {
    if (active === current) return;
    setPrev(current);
    setCurrent(active);
  }, [active, current]);

  return (
    <div className={styles.scenes} aria-hidden="true">
      {SCENES.map((name, i) => {
        const state = i === current ? styles.sceneActive : i === prev ? styles.scenePrev : '';
        return (
          <div key={name} className={`${styles.scene} ${styles[name]} ${state}`}>
            <span className={styles.orbA} />
            <span className={styles.orbB} />
          </div>
        );
      })}
      <div className={styles.grain} />
    </div>
  );
}

/* ---------- Cabecera fija que se oculta al bajar y vuelve al subir ---------- */
export function Header() {
  const { scrolled, hidden } = useScrollDirection();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const cls = [styles.header, scrolled && !open && styles.headerScrolled, hidden && !open && styles.headerHidden]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={cls}>
      <div className={styles.headerInner}>
        <a href="#top" className={styles.headerLogo} aria-label={`${brand.name}, ir al inicio`}>
          <OrigamiLogo variant="full" play="mount" delay={2600} span={900} className={styles.headerOri} />
        </a>
        <nav className={styles.headerNav} aria-label="Principal">
          {nav.slice(0, 3).map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <AnMagnetLink href="#contacto" className={`${styles.btn} ${styles.btnDark} ${styles.headerCta}`}>
          <span>Hablemos</span>
        </AnMagnetLink>
        <button
          type="button"
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          aria-expanded={open}
          aria-controls="mq-andromeda-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
      <div id="mq-andromeda-menu" className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`} hidden={!open}>
        <ul>
          {nav.map((item, i) => (
            <li key={item.href} style={{ '--i': i } as CSSProperties}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ---------- Footer que aparece al llegar al final (≈ footer-scroll.js) ---------- */
export function Footer({ visible }: { visible: boolean }) {
  return (
    <footer className={`${styles.footer} ${visible ? styles.footerVisible : ''}`}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <OrigamiLogo variant="full" play="inView" className={styles.footerOri} />
          <p>{brand.claim}</p>
        </div>
        <div>
          <h3 className={styles.footerTitle}>Navegación</h3>
          <ul className={styles.footerList}>
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={styles.footerTitle}>Contacto</h3>
          <ul className={styles.footerList}>
            <li>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li>LinkedIn · GitHub</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerLegal}>
        <span>© {new Date().getFullYear()} {brand.fullName}</span>
        <span>
          <a href="#">Aviso legal</a> · <a href="#">Privacidad</a> · <a href="#">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
