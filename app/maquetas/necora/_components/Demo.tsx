'use client';

import CrmDemo from '@/app/maquetas/_crm/CrmDemo';
import { Reveal, Words } from '@/app/maquetas/_motion/motion';
import styles from '../necora.module.css';

export function Demo() {
  return (
    <section id="demo" className={styles.ncDemo} aria-label="Prueba el mini CRM">
      <div className={styles.ncSectionHead}>
        <Words text="Pruébalo tú mismo." as="h2" className={styles.ncSectionTitle} effect="blur" once />
        <Reveal from="up" delay={0.15} as="p" className={styles.ncSectionLead} once>
          Arrastra oportunidades, personaliza módulos y añade campos. Es una demo editable de ejemplo.
        </Reveal>
      </div>
      <Reveal from="scale" delay={0.1} duration={1} amount={0.05} once className={styles.ncDemoFrame}>
        <CrmDemo />
      </Reveal>
    </section>
  );
}
