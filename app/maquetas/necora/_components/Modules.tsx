'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal, Words, useInView, usePrefersReducedMotion } from '@/app/maquetas/_motion/motion';
import { modules } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

export function Modules() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.25, once: true });
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      const all: Record<string, boolean> = {};
      modules.forEach((m) => {
        all[m.id] = true;
      });
      setOn(all);
      return;
    }
    const timers: number[] = [];
    modules.forEach((m, i) => {
      timers.push(
        window.setTimeout(() => {
          setOn((prev) => ({ ...prev, [m.id]: true }));
        }, 180 + i * 140),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduced]);

  return (
    <section id="modulos" className={styles.ncModules} aria-label="Módulos del CRM">
      <div className={styles.ncSectionHead}>
        <Words text="Activa solo lo que necesitas." as="h2" className={styles.ncSectionTitle} effect="blur" once />
        <Reveal from="up" delay={0.12} as="p" className={styles.ncSectionLead} once>
          Cada módulo se enciende cuando lo quieres. Empieza con lo esencial y crece sin fricción.
        </Reveal>
      </div>
      <div ref={ref} className={styles.ncModuleGrid}>
        {modules.map((mod, i) => (
          <Reveal key={mod.id} from="up" delay={i * 0.05} once={false} className={styles.ncModuleCard}>
            <div className={styles.ncModuleTop}>
              <strong>{mod.name}</strong>
              <span
                className={`${styles.ncToggle} ${on[mod.id] ? styles.ncToggleOn : ''}`}
                aria-hidden="true"
              >
                <i />
              </span>
            </div>
            <p>{mod.desc}</p>
            {mod.core ? <em className={styles.ncCoreTag}>Esencial</em> : null}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
