'use client';

import { Reveal, Words } from '@/app/maquetas/_motion/motion';
import { includes } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

export function Includes() {
  return (
    <section id="incluye" className={styles.ncIncludes} aria-label="Qué incluye">
      <div className={styles.ncSectionHead}>
        <Words text="Qué incluye." as="h2" className={styles.ncSectionTitle} effect="blur" once />
      </div>
      <div className={styles.ncIncludeGrid}>
        {includes.map((item, i) => (
          <Reveal key={item.title} from="up" delay={i * 0.06} once className={styles.ncIncludeItem}>
            <span className={styles.ncIncludeNum}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
