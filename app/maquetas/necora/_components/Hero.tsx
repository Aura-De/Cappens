'use client';

import { useRef, useState, type CSSProperties } from 'react';
import { CrmPreview } from '@/app/maquetas/_crm/CrmPreview';
import { Reveal, Words, useMouseMask, usePrefersReducedMotion } from '@/app/maquetas/_motion/motion';
import { product } from '@/lib/maquetas/product';
import { ActivityFeed } from './ActivityFeed';
import styles from '../necora.module.css';

export function Hero({ ready }: { ready: boolean }) {
  const maskRef = useRef<HTMLDivElement | null>(null);
  const [active] = useMouseMask(maskRef);
  const [tapped, setTapped] = useState(false);
  const reduced = usePrefersReducedMotion();
  const revealing = reduced || active || tapped;

  return (
    <section id="top" className={styles.ncHero} aria-label="Producto Cappens">
      <div className={styles.ncHeroGrid}>
        <div className={styles.ncHeroCopy}>
          {ready ? (
            <Words
              text={product.heroTitle}
              as="h1"
              effect="blur"
              className={styles.ncHeroTitle}
              stagger={0.08}
              delay={0.05}
              once
            />
          ) : (
            <h1 className={styles.ncHeroTitle} aria-label={product.heroTitle.join(' ')}>
              {product.heroTitle.map((line) => (
                <span key={line} className={styles.ncHeroTitleLine}>
                  {line}
                </span>
              ))}
            </h1>
          )}
          <Reveal from="up" delay={0.28} once className={styles.ncHeroLead} as="p">
            {product.heroLead}
          </Reveal>
          <div className={styles.ncHeroActions}>
            <Reveal from="up" delay={0.4} once>
              <a className={styles.ncBtnPrimary} href="#contacto">
                {product.heroCta.primary}
              </a>
            </Reveal>
            <Reveal from="up" delay={0.5} once>
              <a className={styles.ncBtnGhost} href="#story">
                {product.heroCta.secondary}
              </a>
            </Reveal>
          </div>
        </div>

        <Reveal from="scale" delay={0.22} duration={1} once className={styles.ncHeroMedia}>
          <div
            ref={maskRef}
            className={`${styles.ncDevice} ${revealing ? styles.ncDeviceOn : ''}`}
            role="button"
            aria-pressed={revealing}
            aria-label={product.revealHint}
            tabIndex={0}
            onClick={() => setTapped((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTapped((v) => !v);
              }
            }}
          >
            <div className={styles.ncLaptop}>
              <div className={styles.ncLaptopBezel}>
                <div className={styles.ncLaptopScreen}>
                  <div className={styles.ncChaos} aria-hidden="true">
                    {product.before.map((item, i) => (
                      <span
                        key={item}
                        className={styles.ncChaosItem}
                        style={
                          {
                            '--i': String(i),
                            '--rot': `${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}deg`,
                          } as CSSProperties
                        }
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className={styles.ncRevealLayer}>
                    <CrmPreview progress={1} />
                    <ActivityFeed />
                  </div>
                </div>
              </div>
              <div className={styles.ncLaptopBase} aria-hidden="true" />
            </div>
            <p className={styles.ncRevealHint}>{product.revealHint}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
