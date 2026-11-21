'use client';

import { useRef, useState } from 'react';
import { EmployeeAvatar } from '@/app/maquetas/_crm/EmployeeAvatar';
import { Reveal, Words, useInView } from '@/app/maquetas/_motion/motion';
import { employees } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

type Card = {
  key: string;
  id: string;
  name: string;
  role: string;
  skill: string;
  color: string;
  isNew?: boolean;
};

const baseCards: Card[] = employees.map((e) => ({
  key: e.id,
  id: e.id,
  name: e.name,
  role: e.role,
  skill: e.skill,
  color: e.color,
}));

export function Team() {
  const [extra, setExtra] = useState<Card[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(gridRef, { amount: 0.12, once: true });

  function spawn() {
    const n = extra.length + 1;
    const colors = ['sage', 'sand', 'sky', 'clay', 'stone'] as const;
    setExtra((prev) => [
      ...prev,
      {
        key: `spawn-${Date.now()}`,
        id: 'nuevo',
        name: `Nova ${n}`,
        role: 'A medida',
        skill: 'Empleado creado al instante para la tarea que describes.',
        color: colors[n % colors.length],
        isNew: true,
      },
    ]);
  }

  const cards = [...baseCards.filter((c) => c.id !== 'nuevo'), ...extra, baseCards.find((c) => c.id === 'nuevo')!];

  return (
    <section id="equipo" className={styles.ncTeam} aria-label="Tu equipo digital">
      <div className={styles.ncSectionHead}>
        <Words text="Tu equipo digital." as="h2" className={styles.ncSectionTitle} effect="rise" once stagger={0.04} />
        <Reveal from="up" delay={0.1} as="p" className={styles.ncSectionLead} once>
          Un equipo digital que trabaja dentro de tu CRM. Crea los que necesites.
        </Reveal>
      </div>
      <div ref={gridRef} className={`${styles.ncTeamGrid} ${inView ? styles.ncTeamGridIn : ''}`}>
        {cards.map((card, i) => {
          const isSpawn = card.id === 'nuevo' && !card.isNew;
          const style = { ['--i' as string]: String(Math.min(i, 8)) };
          if (isSpawn) {
            return (
              <button
                key={card.key}
                type="button"
                className={`${styles.ncTeamCard} ${styles.ncTeamCardNew}`}
                style={style}
                onClick={spawn}
              >
                <EmployeeAvatar id="nuevo" name="+" size={56} />
                <strong>{card.name}</strong>
                <span>{card.role}</span>
                <p>{card.skill}</p>
              </button>
            );
          }
          return (
            <article
              key={card.key}
              className={`${styles.ncTeamCard} ${card.isNew ? styles.ncTeamCardSpawn : ''}`}
              data-tone={card.color}
              style={style}
            >
              <EmployeeAvatar id={card.id === 'nuevo' ? 'nuevo' : card.id} name={card.name} size={56} working />
              <strong>{card.name}</strong>
              <span>{card.role}</span>
              <p>{card.skill}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
