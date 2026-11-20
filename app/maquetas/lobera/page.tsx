'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import {
  brand,
  nav,
  services,
  servicesIntro,
  process,
  projects,
  stackTools,
  contact,
} from '@/lib/maquetas/content';
import {
  Reveal,
  Words,
  useCountUp,
  useInView,
  useParallax,
  usePrefersReducedMotion,
  useSmoothScroll,
} from '@/app/maquetas/_motion/motion';
import { OrigamiLogo } from '../_motion/OrigamiLogo';
import s from './lobera.module.css';

const sectors = [
  {
    title: 'Operaciones conectadas',
    text: 'Unifica información, equipos y herramientas en una plataforma que se adapta a tu forma de trabajar.',
    detail:
      'Un punto de partida: identificar los datos que se duplican y conectar los sistemas que ya utilizas.',
  },
  {
    title: 'Conocimiento disponible',
    text: 'Convierte documentación dispersa en respuestas útiles para las personas de tu equipo.',
    detail:
      'Un punto de partida: un asistente sobre documentación seleccionada, con fuentes y permisos definidos.',
  },
  {
    title: 'Decisiones con datos',
    text: 'Ordena tus datos para entender qué ocurre y decidir el siguiente paso con más contexto.',
    detail:
      'Un punto de partida: acordar los indicadores relevantes y construir una vista compartida de la operación.',
  },
  {
    title: 'Procesos que avanzan',
    text: 'Reduce tareas repetitivas y reserva el criterio humano para lo que realmente lo necesita.',
    detail:
      'Un punto de partida: automatizar una tarea concreta y medir su resultado antes de ampliar el alcance.',
  },
];

const insights = [
  {
    category: 'IA APLICADA',
    title: 'Antes de elegir un modelo, elige un problema.',
    text: 'Empieza por una tarea repetitiva y un resultado medible. Un piloto pequeño permite comprobar si la IA aporta valor antes de extenderla.',
  },
  {
    category: 'PRODUCTO DIGITAL',
    title: 'El software a medida empieza escuchando.',
    text: 'Hablar con quienes usan el sistema ayuda a distinguir las funciones necesarias de las que añaden complejidad. El primer prototipo debe resolver esa diferencia.',
  },
  {
    category: 'INTEGRACIONES',
    title: 'Tus herramientas funcionan mejor conectadas.',
    text: 'Antes de reemplazar una herramienta, revisa qué información necesita compartir. Una integración concreta puede evitar trabajo duplicado y errores manuales.',
  },
];

const guarantees = [
  'Alcance y entregables claros',
  'Documentación para tu equipo',
  'Revisión humana de la IA',
  'Acompañamiento al desplegar',
];

function Visual({ variant = 0 }: { variant?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const y = useParallax(ref, reduced ? 0 : 48);
  return (
    <div
      ref={ref}
      className={`${s.visual} ${s[`visual${variant % 3}`]} ${s.lbParallax}`}
      style={{ ['--lb-py' as string]: `${y}px` }}
      aria-hidden="true"
    >
      <div className={s.visualGrid} />
      <span className={s.orbit} />
      <span className={s.orbitInner} />
      <OrigamiLogo variant="mark" play="inView" span={900} className={s.dolphin} />
      <span className={s.coordinate}>C / {String(variant + 1).padStart(2, '0')}</span>
      <span className={s.visualCaption}>
        {['SISTEMAS QUE CONECTAN', 'PENSAMIENTO APLICADO', 'DE LA IDEA AL PRODUCTO'][variant % 3]}
      </span>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className={s.label}>
      <span aria-hidden="true">+</span> <span data-scramble>{children}</span>
    </p>
  );
}

function Arrow({ children = '↗' }: { children?: string }) {
  return (
    <span className={s.lbArrow} aria-hidden="true">
      {children}
    </span>
  );
}

function CountPad({ to, active, pad = 2 }: { to: number; active: boolean; pad?: number }) {
  const n = useCountUp(to, active);
  return <>{String(n).padStart(pad, '0')}</>;
}

function ProcessRow({
  item,
  index,
}: {
  item: (typeof process)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.25, once: false });
  const step = Number.parseInt(item.step, 10);

  return (
    <Reveal from="up" delay={index * 0.08} once={false}>
      <article
        ref={ref}
        id={`paso-${item.step}`}
        className={s.processRow}
        data-visible={inView ? 'true' : 'false'}
      >
        <span className={s.stepNumber}>
          <CountPad to={step} active={inView} />
        </span>
        <div className={s.processCopy}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <span className={s.small}>CAPACIDAD + PENSAMIENTO</span>
        </div>
        <Visual variant={index + 2} />
      </article>
    </Reveal>
  );
}

function GuaranteeItem({ item, index }: { item: string; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.4, once: false });
  return (
    <Reveal from="up" delay={index * 0.07} once={false}>
      <div ref={ref} className={s.lbCardLift}>
        <span className={s.seal} aria-hidden="true">
          <CountPad to={index + 1} active={inView} /> <Arrow />
        </span>
        <h3>{item}</h3>
        <span className={s.small}>GARANTÍA DE EJEMPLO</span>
      </div>
    </Reveal>
  );
}

function TitleRise({
  id,
  text,
  className,
}: {
  id: string;
  text: string | readonly string[];
  className?: string;
}) {
  return (
    <h2 id={id} className={`${s.lbTitleHost} ${className ?? ''}`.trim()}>
      <Words text={text} as="span" effect="rise" className={s.lbWords} once={false} />
    </h2>
  );
}

export default function LoberaPage() {
  useSmoothScroll({ lerp: 0.1 });

  const root = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; active: boolean } | null>(null);
  const [menu, setMenu] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    const frames = new Set<number>();
    let scrollFrame = 0;
    const originals = new Map<HTMLElement, string>();
    const reset = () => {
      observer?.disconnect();
      frames.forEach(cancelAnimationFrame);
      frames.clear();
      originals.forEach((text, el) => {
        el.textContent = text;
      });
      host.style.setProperty('--scroll-shift', '0px');
      host.style.setProperty('--page-progress', '0');
    };
    const animateText = (el: HTMLElement) => {
      const original = el.textContent ?? '';
      originals.set(el, original);
      el.setAttribute('aria-label', original);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 800, 1);
        el.textContent = Array.from(original, (char, index) =>
          char === ' ' || index / original.length < progress
            ? char
            : 'CAPENS0123456789'[(index + Math.floor(now / 55)) % 15],
        ).join('');
        if (progress < 1) {
          const id = requestAnimationFrame((time) => {
            frames.delete(id);
            tick(time);
          });
          frames.add(id);
        } else el.textContent = original;
      };
      tick(start);
    };
    const setup = () => {
      reset();
      if (media.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            if (el.hasAttribute('data-scramble')) animateText(el);
            observer?.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );
      host.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
        observer?.observe(el);
      });
    };
    const updateScroll = () => {
      scrollFrame = 0;
      if (media.matches) return;
      const rect = host.getBoundingClientRect();
      host.style.setProperty('--scroll-shift', `${Math.min(window.scrollY * 0.16, 130)}px`);
      host.style.setProperty(
        '--page-progress',
        String(Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)))),
      );
    };
    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
    };
    setup();
    updateScroll();
    media.addEventListener('change', setup);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      reset();
      cancelAnimationFrame(scrollFrame);
      media.removeEventListener('change', setup);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setStatus('');
    try {
      const response = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          company: String(data.get('company') ?? ''),
          message: String(data.get('message') ?? ''),
        }),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== 'object' ||
        result === null ||
        !('ok' in result) ||
        result.ok !== true
      )
        throw new Error('request');
      setStatus('Solicitud aceptada por la demo. El envío de correo todavía no está conectado.');
      form.reset();
    } catch {
      setStatus('No se ha podido enviar. Tus datos siguen en el formulario; inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  }

  function moveSlider(direction: number) {
    const el = slider.current;
    if (el)
      el.scrollBy({
        left: direction * (el.clientWidth < 700 ? el.clientWidth * 0.88 : el.clientWidth / 3),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
  }

  return (
    <div ref={root} className={s.page}>
      <a className={s.skip} href="#contenido">
        Saltar al contenido
      </a>
      <div className={s.progress} aria-hidden="true" />
      <header
        className={s.header}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            if (menu)
              event.currentTarget
                .querySelector<HTMLButtonElement>('button[aria-controls="lobera-menu"]')
                ?.focus();
            setMenu(false);
            const details = event.currentTarget.querySelectorAll('details[open]');
            details.forEach((el) => {
              el.removeAttribute('open');
              el.querySelector('summary')?.focus();
            });
          }
        }}
      >
        <Link href="/maquetas/lobera" aria-label="Cappens, inicio">
          <OrigamiLogo variant="full" play="mount" delay={200} className={s.logo} />
        </Link>
        <button
          type="button"
          className={s.menuButton}
          aria-expanded={menu}
          aria-controls="lobera-menu"
          onClick={() => setMenu(!menu)}
        >
          {menu ? 'Cerrar −' : 'Menú +'}
        </button>
        <nav
          id="lobera-menu"
          aria-label="Navegación principal"
          className={`${s.navigation} ${menu ? s.menuOpen : ''}`}
        >
          <details className={s.dropdown}>
            <summary>
              Qué hacemos <span aria-hidden="true">⌄</span>
            </summary>
            <div>
              {services.map((item) => (
                <Link key={item.id} href={`#${item.id}`} onClick={() => setMenu(false)} className={s.lbNavLink}>
                  {item.title} <Arrow />
                </Link>
              ))}
              <Link href="#despliegue" onClick={() => setMenu(false)} className={s.lbNavLink}>
                Ámbitos de aplicación <Arrow />
              </Link>
            </div>
          </details>
          <details className={s.dropdown}>
            <summary>
              Cómo trabajamos <span aria-hidden="true">⌄</span>
            </summary>
            <div>
              {process.slice(0, 3).map((item) => (
                <Link key={item.step} href={`#paso-${item.step}`} onClick={() => setMenu(false)} className={s.lbNavLink}>
                  {item.step} / {item.title}
                </Link>
              ))}
            </div>
          </details>
          <Link href="#proyectos" onClick={() => setMenu(false)} className={s.lbNavLink}>
            Proyectos
          </Link>
          <Link className={`${s.headerCta} ${s.lbCta}`} href="#contacto" onClick={() => setMenu(false)}>
            Hablemos <Arrow />
          </Link>
        </nav>
      </header>

      <main id="contenido">
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroTexture} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={s.heroTop}>
            <span>SOFTWARE + INTELIGENCIA ARTIFICIAL</span>
            <span>CAPACIDAD / PENSAMIENTO</span>
          </div>
          <h1 id="hero-title" className={s.heroTitle} aria-label={brand.claimWords.join(' ')}>
            {brand.claimWords.map((word, index) => (
              <span className={s.wordMask} key={word}>
                <span style={{ '--word': index } as CSSProperties}>{word}</span>
              </span>
            ))}
          </h1>
          <div className={s.heroBottom}>
            <Reveal from="up" delay={0.35} once={false} as="p">
              {brand.lead}
            </Reveal>
            <Reveal from="up" delay={0.48} once={false}>
              <Link className={`${s.button} ${s.lbCta}`} href="#contacto">
                Cuéntanos tu proyecto <Arrow />
              </Link>
            </Reveal>
          </div>
          <div className={s.heroFoot}>
            <span>TECNOLOGÍA CON PROPÓSITO</span>
            <a href="#que-hacemos" aria-label="Descubrir soluciones" className={s.lbNavLink}>
              DESLIZA PARA EXPLORAR ↓
            </a>
            <span>MAQUETA C / 2026</span>
          </div>
        </section>

        <section id="que-hacemos" className={s.section} aria-labelledby="solutions-title">
          <Label>SOLUCIONES</Label>
          <div className={s.sectionHead}>
            <TitleRise id="solutions-title" text={servicesIntro.title} />
            <Reveal from="up" delay={0.12} once={false} as="p">
              {servicesIntro.subtitle}
              <br />
              Software e IA, con el mismo criterio.
            </Reveal>
          </div>
          <div className={s.twoColumns}>
            {services.map((item, index) => (
              <Reveal key={item.id} from="up" delay={index * 0.1} once={false}>
                <article id={item.id} className={`${s.solutionCard} ${s.lbCardLift}`}>
                  <Visual variant={index} />
                  <div className={s.cardBody}>
                    <span className={s.small}>SOLUCIÓN / {item.tag}</span>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <ul>
                      {item.items.map((text) => (
                        <li key={text}>{text}</li>
                      ))}
                    </ul>
                    <Link href="#contacto" className={`${s.textLink} ${s.lbTextLink}`}>
                      Explorar posibilidades <Arrow />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="proceso" className={`${s.section} ${s.darkSection}`} aria-labelledby="process-title">
          <Label>CÓMO TRABAJAMOS</Label>
          <h2 id="process-title" className={s.processHeading}>
            <Words text="Del problema real." as="span" effect="rise" className={s.lbWords} once={false} />
            <em className={s.lbEmBlock}>
              <Words
                text="Al producto funcionando."
                as="span"
                effect="rise"
                delay={0.12}
                className={s.lbWords}
                once={false}
              />
            </em>
          </h2>
          {process.slice(0, 3).map((item, index) => (
            <ProcessRow key={item.step} item={item} index={index} />
          ))}
          <Reveal from="up" delay={0.1} once={false}>
            <div className={s.followUp}>
              <span className={s.small}>Y DESPUÉS / {process[3].title.toUpperCase()}</span>
              <p>{process[3].text}</p>
              <Link className={`${s.textLink} ${s.lbTextLink}`} href="#contacto">
                Hablemos del siguiente paso <Arrow />
              </Link>
            </div>
          </Reveal>
        </section>

        <section id="despliegue" className={s.section} aria-labelledby="sectors-title">
          <Label>DESPLIEGUE / ÁMBITOS DE APLICACIÓN</Label>
          <div className={s.sectionHead}>
            <h2 id="sectors-title">
              <Words text="Donde tu negocio" as="span" effect="rise" className={s.lbWords} once={false} />
              <em className={s.lbEmBlock}>
                <Words
                  text="necesita avanzar."
                  as="span"
                  effect="rise"
                  delay={0.1}
                  className={s.lbWords}
                  once={false}
                />
              </em>
            </h2>
            <Reveal from="up" delay={0.12} once={false} as="p">
              Partimos de tu contexto.
              <br />
              Construimos una respuesta propia.
            </Reveal>
          </div>
          <div className={s.sectorGrid}>
            {sectors.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 0.08} once={false}>
                <article className={`${s.sectorCard} ${s.lbCardLift}`}>
                  <span className={s.small}>/ 0{index + 1}</span>
                  <span className={s.sectorSymbol} aria-hidden="true">
                    {['⊞', '◎', '↗', '⌘'][index]}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <details className={s.more}>
                    <summary>
                      Ver más <Arrow />
                    </summary>
                    <p>{item.detail}</p>
                    <Link href="#contacto" className={s.lbNavLink}>
                      Consultar este enfoque <Arrow />
                    </Link>
                  </details>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="proyectos" className={`${s.section} ${s.projectSection}`} aria-labelledby="projects-title">
          <Label>PROYECTOS</Label>
          <div className={s.sectionHead}>
            <TitleRise id="projects-title" text="Ideas que toman forma." />
            <Reveal from="up" delay={0.1} once={false} as="p">
              Dos escenarios ilustrativos.
              <br />
              Proyectos de ejemplo, no casos reales.
            </Reveal>
          </div>
          <div className={s.twoColumns}>
            {projects.slice(0, 2).map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 0.1} once={false}>
                <article className={`${s.projectCard} ${s.lbCardLift}`}>
                  <Visual variant={index + 1} />
                  <div className={s.projectMeta}>
                    <span>
                      {item.area} / {item.year}
                    </span>
                    <span>EJEMPLO</span>
                  </div>
                  <h3>{item.title}</h3>
                  <details className={s.more}>
                    <summary>
                      Explorar proyecto <Arrow />
                    </summary>
                    <p>
                      {index === 0
                        ? 'Escenario ilustrativo: un asistente que consulta documentación aprobada y deriva las consultas que requieren atención humana.'
                        : 'Escenario ilustrativo: una plataforma que reúne tareas, información y seguimiento de la actividad de un equipo.'}
                    </p>
                    <Link href="#contacto" className={s.lbNavLink}>
                      Hablemos de una solución similar <Arrow />
                    </Link>
                  </details>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="insights" className={s.section} aria-labelledby="insights-title">
          <Label>IDEAS / INSIGHTS</Label>
          <div className={s.sectionHead}>
            <TitleRise id="insights-title" text="Pensar antes de construir." />
            <div className={s.sliderControls}>
              <button type="button" aria-label="Artículo anterior" onClick={() => moveSlider(-1)}>
                ←
              </button>
              <button type="button" aria-label="Artículo siguiente" onClick={() => moveSlider(1)}>
                →
              </button>
            </div>
          </div>
          <p className={s.exampleNote}>CONTENIDO EDITORIAL DE EJEMPLO</p>
          <div
            ref={slider}
            className={s.insightRail}
            role="region"
            aria-label="Artículos de ejemplo; desliza para explorar"
            tabIndex={0}
            onPointerDown={(event) => {
              if (
                event.pointerType !== 'mouse' ||
                event.button !== 0 ||
                (event.target as HTMLElement).closest('a,button,summary,details')
              )
                return;
              drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, active: false };
            }}
            onPointerMove={(event) => {
              const state = drag.current;
              if (!state || event.buttons !== 1) return;
              if (Math.abs(event.clientX - state.x) > 5) {
                state.active = true;
                event.currentTarget.setPointerCapture(event.pointerId);
                event.currentTarget.dataset.dragging = 'true';
                event.currentTarget.scrollLeft = state.scroll - (event.clientX - state.x);
              }
            }}
            onPointerUp={(event) => {
              drag.current = null;
              delete event.currentTarget.dataset.dragging;
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={(event) => {
              drag.current = null;
              delete event.currentTarget.dataset.dragging;
            }}
            onPointerLeave={(event) => {
              if (!drag.current?.active) {
                drag.current = null;
                delete event.currentTarget.dataset.dragging;
              }
            }}
          >
            {insights.map((item, index) => (
              <Reveal key={item.title} from="up" delay={index * 0.08} once={false}>
                <article className={`${s.insightCard} ${s.lbCardLift}`}>
                  <div className={`${s.insightArt} ${s[`art${index}`]}`} aria-hidden="true">
                    <span>0{index + 1}</span>
                    <i />
                  </div>
                  <span className={s.small}>{item.category} / LECTURA BREVE</span>
                  <h3>{item.title}</h3>
                  <details className={s.more}>
                    <summary>
                      Leer idea <Arrow />
                    </summary>
                    <p>{item.text}</p>
                  </details>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className={`${s.section} ${s.guaranteeSection}`} aria-labelledby="guarantees-title">
          <Label>GARANTÍAS / PROPUESTA DE EJEMPLO</Label>
          <h2 id="guarantees-title">
            <Words text="La confianza también" as="span" effect="rise" className={s.lbWords} once={false} />
            <em className={s.lbEmBlock}>
              <Words
                text="se construye."
                as="span"
                effect="rise"
                delay={0.1}
                className={s.lbWords}
                once={false}
              />
            </em>
          </h2>
          <Reveal from="up" delay={0.08} once={false} as="p" className={s.guaranteeNote}>
            Garantías genéricas de ejemplo para esta maqueta. No representan certificaciones ni compromisos
            contractuales.
          </Reveal>
          <div className={s.guarantees}>
            {guarantees.map((item, index) => (
              <GuaranteeItem key={item} item={item} index={index} />
            ))}
          </div>
          <Reveal from="up" delay={0.15} once={false}>
            <Link className={`${s.button} ${s.lbCta}`} href="#contacto">
              Solicita una sesión técnica <Arrow />
            </Link>
          </Reveal>
        </section>

        <section className={s.toolsSection} aria-label="Herramientas con las que conectar">
          <Label>EN CONEXIÓN CON TUS HERRAMIENTAS</Label>
          <div className={s.marquee}>
            <div className={s.marqueeTrack}>
              {[0, 1].map((copy) => (
                <div key={copy} className={s.marqueeGroup} aria-hidden={copy === 1 ? true : undefined}>
                  {stackTools.map((tool) => (
                    <span key={tool}>
                      {tool}
                      <span aria-hidden="true">↗</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className={`${s.section} ${s.contactSection}`} aria-labelledby="contact-title">
          <div>
            <Label>HABLEMOS</Label>
            <TitleRise id="contact-title" text={contact.title} />
            <Reveal from="up" delay={0.1} once={false} as="p">
              {contact.lead}
            </Reveal>
            <div className={s.contactMark} aria-hidden="true">
              <OrigamiLogo variant="mark" play="inView" className={s.contactOri} />
            </div>
            <p className={s.exampleNote}>FORMULARIO DE DEMOSTRACIÓN · SIN ENVÍO DE CORREO</p>
          </div>
          <Reveal from="up" delay={0.12} once={false}>
            <form onSubmit={submit} className={s.form} aria-busy={sending}>
              <label>
                Nombre
                <input name="name" autoComplete="name" required maxLength={150} />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required maxLength={254} />
              </label>
              <label className={s.fullField}>
                Empresa <span>(opcional)</span>
                <input name="company" autoComplete="organization" maxLength={200} />
              </label>
              <label className={s.fullField}>
                ¿Qué tienes en mente?
                <textarea name="message" required rows={4} maxLength={5000} />
              </label>
              <p className={`${s.formNote} ${s.fullField}`}>
                No incluyas información sensible. Esta maqueta valida la solicitud, pero todavía no la entrega por
                correo.
              </p>
              <button className={`${s.button} ${s.lbCta} ${s.fullField}`} type="submit" disabled={sending}>
                {sending ? 'Enviando…' : 'Enviar consulta'} <Arrow />
              </button>
              <p role="status" aria-live="polite" className={s.fullField}>
                {status}
              </p>
            </form>
          </Reveal>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.footerTop}>
          <div>
            <span className={s.footerLogo}>
              <OrigamiLogo variant="full" play="inView" style={{ width: '100%' }} />
            </span>
            <p>{brand.claim}</p>
          </div>
          <div>
            <span className={s.small}>EXPLORAR</span>
            {nav.map((item) => (
              <Link href={item.href} key={item.href} className={s.lbNavLink}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <span className={s.small}>CAPACIDADES</span>
            {services.map((item) => (
              <Link href={`#${item.id}`} key={item.id} className={s.lbNavLink}>
                {item.title}
              </Link>
            ))}
            <Link href="#insights" className={s.lbNavLink}>
              Ideas e insights
            </Link>
          </div>
          <div>
            <span className={s.small}>EL SIGUIENTE PASO</span>
            <Link href="#contacto" className={s.lbNavLink}>
              Solicita una sesión técnica <Arrow />
            </Link>
            <Link href="/maquetas" className={s.lbNavLink}>
              Volver a las maquetas <Arrow />
            </Link>
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>© {brand.fullName} / 2026</span>
          <span>MAQUETA C · CONTENIDO ILUSTRATIVO</span>
          <a href="#contenido" className={s.lbNavLink}>
            Volver arriba ↑
          </a>
        </div>
      </footer>
    </div>
  );
}
