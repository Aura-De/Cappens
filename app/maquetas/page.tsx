'use client';

import Link from 'next/link';
import { useState } from 'react';
import { OrigamiLogo } from './_motion/OrigamiLogo';
import { Reveal, Words } from './_motion/motion';

const MAQUETAS = [
  {
    href: '/maquetas/necora',
    tag: 'Principal',
    name: 'Producto · Empleados digitales + CRM a medida',
    ref: 'Estilo necora.pro',
    note: 'Página de producto estilo Necora llevada más allá: equipo de empleados digitales infinitos trabajando dentro de un CRM a medida, con demo en vivo, aprobaciones y logo origami.',
  },
  {
    href: '/maquetas/andromeda',
    tag: 'B',
    name: 'Editorial',
    ref: 'Estilo andromedainnovacion.es',
    note: 'Fondos que cambian por sección, titulares palabra a palabra, círculos y carrusel.',
  },
  {
    href: '/maquetas/lobera',
    tag: 'C',
    name: 'Corporativo técnico',
    ref: 'Estilo lobera.ai',
    note: 'Etiquetas que se descifran, secciones numeradas, desplegables y franja de herramientas.',
  },
];

export default function MaquetasIndex() {
  const [run, setRun] = useState(0);
  return (
    <main
      style={{
        maxWidth: 1040,
        margin: '0 auto',
        paddingInline: 'max(16px, var(--mq-pad))',
        paddingBlock: 'clamp(40px, 8vw, 96px)',
        display: 'grid',
        gap: 'clamp(40px, 7vw, 72px)',
      }}
    >
      <header style={{ display: 'grid', justifyItems: 'start', gap: 20 }}>
        <OrigamiLogo key={run} variant="full" play="mount" delay={250} span={1200} style={{ width: 'min(460px, 86vw)' }} />
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          style={{
            font: '500 13px/1 var(--mq-body)',
            padding: '10px 16px',
            borderRadius: 999,
            border: '1px solid var(--mq-rule)',
            background: 'var(--mq-bg-hi)',
            color: 'var(--mq-ink)',
            cursor: 'pointer',
          }}
        >
          ↻ Repetir el plegado
        </button>
        <p style={{ color: 'var(--mq-ink-2)', fontSize: 14 }}>Pasa el cursor (o toca) el delfín para ver la onda de pliegues.</p>
      </header>

      <section style={{ display: 'grid', gap: 12 }}>
        <Words
          as="h1"
          text={['Maquetas de la web', 'de Cappens']}
          style={{ font: '400 clamp(36px, 6vw, 68px)/1.04 var(--mq-display)', letterSpacing: '-0.01em' }}
          stagger={0.08}
          once
        />
        <Reveal delay={0.3} once>
          <p style={{ color: 'var(--mq-ink-2)', maxWidth: '60ch' }}>
            Tres direcciones con la misma marca. La principal es la página de producto: empleados digitales infinitos que
            trabajan dentro de un CRM a medida. Solo para revisión interna: textos y datos de ejemplo, el formulario no envía nada.
          </p>
        </Reveal>
      </section>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
        {MAQUETAS.map((m, i) => (
          <Reveal as="li" key={m.href} from="up" delay={0.08 * i} once>
            <Link
              href={m.href}
              style={{
                display: 'grid',
                gap: 6,
                padding: 'clamp(20px, 3vw, 28px)',
                border: '1px solid var(--mq-rule)',
                borderRadius: 18,
                background: i === 0 ? 'var(--mq-graphite)' : 'var(--mq-bg-hi)',
                color: i === 0 ? 'var(--mq-paper)' : 'inherit',
                textDecoration: 'none',
              }}
            >
              <span style={{ font: '500 11px/1 var(--mq-body)', letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.7 }}>
                {m.tag} · {m.ref}
              </span>
              <strong style={{ font: '400 clamp(24px, 3.4vw, 34px)/1.1 var(--mq-display)' }}>{m.name} →</strong>
              <span style={{ opacity: 0.78, maxWidth: '62ch' }}>{m.note}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </main>
  );
}
