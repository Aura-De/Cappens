'use client';

import type { CSSProperties } from 'react';
import { Reveal, Words } from '@/app/maquetas/_motion/motion';
import styles from '../necora.module.css';

const panels = [
  {
    id: 'crm',
    title: 'Trabajan dentro de tu CRM',
    text: 'Cada acción queda en la ficha del cliente: correo, propuesta, cobro o reunión. Sin cajas negras.',
    side: 'right' as const,
    visual: 'crm' as const,
  },
  {
    id: 'aprobar',
    title: 'Tú apruebas, ellos ejecutan',
    text: 'Decide qué hacen solos y qué te piden antes. Corriges en un clic y todo queda trazado.',
    side: 'left' as const,
    visual: 'approve' as const,
  },
  {
    id: 'medida',
    title: 'Tu CRM, a tu medida',
    text: 'Campos, etapas y módulos configurados contigo. Activa solo lo que usas y crece cuando haga falta.',
    side: 'right' as const,
    visual: 'modules' as const,
  },
] as const;

function MiniUi({ kind }: { kind: (typeof panels)[number]['visual'] }) {
  if (kind === 'crm') {
    return (
      <div className={`${styles.ncMini} ${styles.ncMiniContacts}`} aria-hidden="true">
        {['Lía · respondió', 'Teo · movió a Propuesta', 'Vera · agendó'].map((name, i) => (
          <div key={name} className={styles.ncMiniRow} style={{ '--d': `${i * 0.4}s` } as CSSProperties}>
            <b />
            <span>{name}</span>
            <em />
          </div>
        ))}
        <div className={styles.ncMiniTasks}>
          <label>
            <input type="checkbox" defaultChecked readOnly tabIndex={-1} /> Historial en la ficha
          </label>
          <label>
            <input type="checkbox" defaultChecked readOnly tabIndex={-1} /> Visible para el equipo
          </label>
        </div>
      </div>
    );
  }
  if (kind === 'approve') {
    return (
      <div className={`${styles.ncMini} ${styles.ncMiniApprove}`} aria-hidden="true">
        <div className={styles.ncApproveCard}>
          <span>Pendiente de aprobación</span>
          <strong>Enviar propuesta a Academia Delta</strong>
          <p>Teo ha preparado el PDF y espera tu OK.</p>
          <div className={styles.ncApproveActions}>
            <i className={styles.ncApproveGhost}>Revisar</i>
            <i className={styles.ncApproveGo}>Aprobar</i>
          </div>
        </div>
        <div className={styles.ncApprovePulse} />
      </div>
    );
  }
  return (
    <div className={`${styles.ncMini} ${styles.ncMiniModules}`} aria-hidden="true">
      {['Contactos', 'Pipeline', 'Agenda', 'IA'].map((name, i) => (
        <div key={name} className={styles.ncToggleRow} style={{ '--d': `${i * 0.28}s` } as CSSProperties}>
          <span>{name}</span>
          <span className={`${styles.ncToggle} ${i < 3 ? styles.ncToggleOn : ''}`}>
            <i />
          </span>
        </div>
      ))}
    </div>
  );
}

export function Features() {
  return (
    <section id="que-hacemos" className={styles.ncFeatures} aria-label="Qué hace Cappens">
      <div className={styles.ncSectionHead}>
        <Words text="Empleados digitales con control." as="h2" className={styles.ncSectionTitle} effect="blur" once />
      </div>
      <div className={styles.ncFeatureList}>
        {panels.map((panel) => {
          const visualFirst = panel.side === 'left';
          return (
            <article
              key={panel.id}
              className={`${styles.ncFeaturePanel} ${visualFirst ? styles.ncFeatureLeft : styles.ncFeatureRight}`}
            >
              <Reveal
                from={visualFirst ? 'left' : 'right'}
                once
                className={styles.ncFeatureVisual}
              >
                <MiniUi kind={panel.visual} />
              </Reveal>
              <Reveal
                from={visualFirst ? 'right' : 'left'}
                delay={0.12}
                once
                className={styles.ncFeatureCopy}
              >
                <h3>{panel.title}</h3>
                <p>{panel.text}</p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}
