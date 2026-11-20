'use client';

import { useEffect, useRef, useState } from 'react';
import { EmployeeAvatar } from '@/app/maquetas/_crm/EmployeeAvatar';
import { Reveal, Words, useInView, usePrefersReducedMotion } from '@/app/maquetas/_motion/motion';
import { employees, useCases } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

function namedEmployee(ask: string): { id: string; name: string } | null {
  for (const e of employees) {
    if (e.id === 'nuevo') continue;
    if (ask.includes(e.name)) return { id: e.id, name: e.name };
  }
  return null;
}

function TypeBubble({ text, active }: { text: string; active: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduced ? text : '');

  useEffect(() => {
    if (!active) {
      setShown(reduced ? text : '');
      return;
    }
    if (reduced) {
      setShown(text);
      return;
    }
    let i = 0;
    setShown('');
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [active, text, reduced]);

  return <p className={styles.ncAsk}>{shown}</p>;
}

function CaseCard({
  item,
  index,
}: {
  item: (typeof useCases)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.45, once: false });
  const [showResult, setShowResult] = useState(false);
  const reduced = usePrefersReducedMotion();
  const who = namedEmployee(item.ask);

  useEffect(() => {
    if (!inView) {
      setShowResult(false);
      return;
    }
    const t = window.setTimeout(
      () => setShowResult(true),
      reduced ? 80 : 520 + item.ask.length * 12,
    );
    return () => window.clearTimeout(t);
  }, [inView, item.ask.length, reduced]);

  return (
    <Reveal from="up" delay={index * 0.05} once={false}>
      <article ref={ref} className={styles.ncCaseInner}>
        <span className={styles.ncCaseSector}>{item.sector}</span>
        <div className={styles.ncBubbleAsk}>
          {who ? (
            <span className={styles.ncCaseWho}>
              <EmployeeAvatar id={who.id} name={who.name} size={28} />
              {who.name}
            </span>
          ) : null}
          <TypeBubble text={item.ask} active={inView} />
        </div>
        <div
          className={`${styles.ncBubbleResult} ${showResult ? styles.ncBubbleResultIn : ''}`}
          aria-hidden={!showResult}
        >
          {who ? <EmployeeAvatar id={who.id} name={who.name} size={28} working /> : null}
          <p>{item.result}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function Cases() {
  return (
    <section id="casos" className={styles.ncCases} aria-label="Casos de uso">
      <div className={styles.ncSectionHead}>
        <Words text="Qué puedes pedirle." as="h2" className={styles.ncSectionTitle} effect="blur" once />
        <Reveal from="up" delay={0.1} as="p" className={styles.ncSectionLead} once>
          Ejemplos por tipo de negocio. La petición se escribe sola; la respuesta llega después.
        </Reveal>
      </div>
      <div className={styles.ncCaseGrid}>
        {useCases.map((item, i) => (
          <CaseCard key={item.sector} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
