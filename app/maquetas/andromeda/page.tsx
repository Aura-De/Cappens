'use client';

import { useCallback, useState } from 'react';
import styles from './andromeda.module.css';
import { Footer, Header, SceneBackground, SCENE_COUNT, Splash } from './_components/Chrome';
import { AnCursor, AnScrollProgress } from './_components/MotionExtras';
import { Areas, Contact, Hero, Process, Projects, Statement } from './_components/Sections';
import { useActiveScene, usePrefersReducedMotion } from './_components/hooks';
import { useSmoothScroll } from '../_motion/motion';

/**
 * Maqueta B · estilo Andrómeda Innovación, con la marca Cappens.
 * Efectos reimplementados sin librerías: splash, fondo por sección con transición de máscara
 * (en lugar de WebGL), SplitText por palabras, desenfoque→nitidez, círculos que se separan,
 * carrusel arrastrable (en lugar de Swiper), scroll-snap y footer que aparece al final.
 */
export default function AndromedaMaqueta() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const active = useActiveScene(SCENE_COUNT);

  useSmoothScroll(); // inercia tipo Lenis (sustituye al scroll-snap)

  const onSplashDone = useCallback(() => setReady(true), []);
  const onContactSeen = useCallback(() => setFooterVisible(true), []);

  return (
    <div className={styles.page}>
      <AnScrollProgress />
      <AnCursor />
      <Splash reduced={reduced} onDone={onSplashDone} />
      <SceneBackground active={active} />
      <Header />
      <main>
        <Hero ready={ready} />
        <Statement />
        <Areas />
        <Projects />
        <Process />
        <Contact onSeen={onContactSeen} />
      </main>
      <Footer visible={footerVisible} />
    </div>
  );
}
