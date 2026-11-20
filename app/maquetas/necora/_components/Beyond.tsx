'use client';

import { Reveal, Words, useInView } from '@/app/maquetas/_motion/motion';
import { useRef } from 'react';
import { beyond } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

export function Beyond() {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <section id="mas-alla" ref={ref} className={styles.ncBeyond} aria-label="Más allá de un asistente">
      <div className={styles.ncSectionHead}>
        <Words text={beyond.title} as="h2" className={styles.ncSectionTitle} effect="blur" once />
        <Reveal from="up" delay={0.1} as="p" className={styles.ncSectionLead} once>
          {beyond.lead}
        </Reveal>
      </div>

      <div className={`${styles.ncBeyondTable} ${inView ? styles.ncBeyondIn : ''}`} role="table" aria-label="Comparativa">
        <div className={styles.ncBeyondHead} role="row">
          <span role="columnheader"> </span>
          <span role="columnheader">Otros</span>
          <span role="columnheader" className={styles.ncBeyondAccent}>
            Cappens
          </span>
        </div>
        {beyond.rows.map((row, i) => (
          <Reveal key={row.label} from="up" delay={0.08 + i * 0.09} once className={styles.ncBeyondRow} as="div">
            <div role="row" className={styles.ncBeyondRowInner}>
              <span role="rowheader">{row.label}</span>
              <span role="cell">{row.others}</span>
              <span role="cell" className={styles.ncBeyondAccent}>
                {row.cappens}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className={styles.ncBeyondCards} aria-hidden={false}>
        {beyond.rows.map((row, i) => (
          <Reveal key={row.label} from="up" delay={0.06 + i * 0.08} once className={styles.ncBeyondCard}>
            <span className={styles.ncBeyondCardLabel}>{row.label}</span>
            <p>
              <strong>Otros:</strong> {row.others}
            </p>
            <p className={styles.ncBeyondAccent}>
              <strong>Cappens:</strong> {row.cappens}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
