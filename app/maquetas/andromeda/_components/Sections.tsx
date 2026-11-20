'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from 'react';
import { brand, contact, process, projects, services, servicesIntro } from '@/lib/maquetas/content';
import { Reveal, Words } from '@/app/maquetas/_motion/motion';
import { OrigamiLogo } from '../../_motion/OrigamiLogo';
import { AnMagnetButton, AnMagnetLink, AnParallax } from './MotionExtras';
import { useInViewOnce } from './hooks';
import styles from '../andromeda.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ---------- Texto partido en palabras (≈ SplitText type: "words") ---------- */
function SplitWords({ text, className, delayStep = 0.05, baseDelay = 0 }: { text: string; className?: string; delayStep?: number; baseDelay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className={styles.wordMask} aria-hidden="true">
            <span className={styles.word} style={{ '--d': `${baseDelay + i * delayStep}s` } as Vars}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}

function SparkStar() {
  return (
    <svg viewBox="0 0 24 24" className={styles.star} aria-hidden="true">
      <path d="M12 0c.7 6.6 5.4 11.3 12 12-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0Z" />
    </svg>
  );
}

/* ---------- 1. Hero: titular que sube palabra a palabra + parallax ---------- */
export function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="top" data-scene="0" className={`${styles.section} ${styles.hero} ${ready ? styles.isIn : ''}`}>
      <AnParallax strength={56} className={styles.anHeroParallax}>
        <div className={styles.heroInner}>
          <p className={styles.kicker}>{brand.fullName}</p>
          <h1 className={styles.heroTitle}>
            <SplitWords text={brand.claim} />
          </h1>
          <p className={styles.heroLead}>
            <SplitWords text={brand.lead} delayStep={0.012} baseDelay={0.45} />
          </p>
          <AnMagnetLink href="#contacto" className={`${styles.btn} ${styles.btnDark} ${styles.heroCta}`}>
            <span>Solicitar información</span>
          </AnMagnetLink>
        </div>
      </AnParallax>
      <a href="#manifiesto" className={styles.scrollHint}>
        <span>Desliza</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}

/* ---------- 2. Manifiesto: palabras desenfocadas que se aclaran (≈ mwm-home-get-info) ---------- */
export function Statement() {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.35);
  const text = `${brand.claimWords.join(' ')} ${servicesIntro.title} ${servicesIntro.subtitle}`;
  const words = text.split(' ');
  return (
    <section id="manifiesto" ref={ref} data-scene="1" className={`${styles.section} ${styles.statement} ${seen ? styles.isIn : ''}`}>
      <p className={styles.statementBig} aria-label={text}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} aria-hidden="true" className={styles.blurWord} style={{ '--d': `${Math.floor(i / 2) * 0.12}s` } as Vars}>
            {w}{' '}
          </span>
        ))}
      </p>
      <div className={styles.statementSide}>
        <p>{brand.lead}</p>
        <a href="#que-hacemos" className={styles.linkArrow}>
          Qué hacemos <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}

/* ---------- 3. Dos áreas con círculos que se separan (≈ mwm-home-project / mwm-circles) ---------- */
export function Areas() {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.3);
  const [software, ia] = services;
  return (
    <section id="que-hacemos" ref={ref} data-scene="2" className={`${styles.section} ${styles.areas} ${styles.dark} ${seen ? styles.isIn : ''}`}>
      <p className={styles.kicker}>Qué hacemos</p>
      <div className={styles.areasGrid}>
        {[software, ia].map((s, idx) => (
          <article key={s.id} className={`${styles.areaCol} ${idx === 0 ? styles.areaCol1 : styles.areaCol2}`}>
            <span className={styles.areaTag}>{s.tag}</span>
            <h2 className={styles.areaTitle}>
              <Words text={s.title} as="span" effect="rise" className={styles.anWords} once={false} />
            </h2>
            <p className={styles.areaSummary}>{s.summary}</p>
            <ul className={styles.areaList}>
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <AnMagnetLink href="#contacto" className={`${styles.btn} ${styles.btnLight}`}>
              <span>{idx === 0 ? 'Tengo un proyecto' : 'Quiero aplicar IA'}</span>
            </AnMagnetLink>
          </article>
        ))}
        <div className={styles.circles} aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`${styles.circle} ${styles[`circle${n}` as 'circle1' | 'circle2' | 'circle3']}`}>
              <span className={styles.circleBorder} />
              <span className={styles.circleOrbit}>
                <SparkStar />
              </span>
            </div>
          ))}
          <OrigamiLogo variant="mark" play="inView" delay={1400} span={900} className={styles.circlesMark} />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  c,
  i,
}: {
  c: { key: string; num: string; title: string; meta: string; soon: boolean };
  i: number;
}) {
  return (
    <article data-card className={`${styles.card} ${c.soon ? styles.cardSoon : ''}`} style={{ '--h': i } as Vars}>
      <AnParallax strength={28 + (i % 3) * 10} className={styles.anCardParallax}>
        <div className={styles.cardMedia}>
          <span className={styles.cardNum}>{c.num}</span>
          <img src={brand.logo.mark} alt="" className={styles.cardMark} draggable={false} />
          <span className={styles.cardBadge}>{c.soon ? 'Próximamente' : 'Ejemplo'}</span>
        </div>
      </AnParallax>
      <div className={styles.cardBody}>
        <span className={styles.cardMeta}>{c.meta}</span>
        <h3 className={styles.cardTitle}>{c.title}</h3>
        <a href="#contacto" className={styles.linkArrow}>
          {c.soon ? 'Cuéntanos tu idea' : 'Ver caso'} <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}

/* ---------- 4. Carrusel de proyectos (≈ Andrómeda Tax Talks + Swiper) ---------- */
export function Projects() {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.25);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setEdges({ start: t.scrollLeft < 8, end: t.scrollLeft + t.clientWidth > t.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [updateEdges]);

  const step = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector<HTMLElement>('[data-card]');
    const w = card ? card.offsetWidth + 24 : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !trackRef.current) return;
    drag.current = { active: true, startX: e.clientX, startScroll: trackRef.current.scrollLeft, moved: false };
    trackRef.current.classList.add(styles.trackDragging);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current;
    if (!drag.current.active || !t) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    t.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    trackRef.current?.classList.remove(styles.trackDragging);
  };

  const cards = [
    ...projects.map((p, i) => ({
      key: p.title,
      num: String(i + 1).padStart(2, '0'),
      title: p.title,
      meta: `${p.area} · ${p.year}`,
      soon: false,
    })),
    { key: 'next', num: '05', title: 'Tu proyecto puede ser el siguiente', meta: 'Próximamente', soon: true },
  ];

  return (
    <section id="proyectos" ref={ref} data-scene="3" className={`${styles.section} ${styles.projects} ${seen ? styles.isIn : ''}`}>
      <div className={styles.projectsHead}>
        <div>
          <p className={styles.kicker}>Proyectos</p>
          <h2 className={styles.h2}>
            <Words text="Casos que explican cómo pensamos." as="span" effect="rise" className={styles.anWords} once={false} />
          </h2>
          <p className={styles.muted}>Ejemplos ilustrativos mientras preparamos los casos reales.</p>
        </div>
        <div className={styles.sliderNav}>
          <button type="button" className={styles.navBtn} onClick={() => step(-1)} disabled={edges.start} aria-label="Anterior">
            ←
          </button>
          <button type="button" className={styles.navBtn} onClick={() => step(1)} disabled={edges.end} aria-label="Siguiente">
            →
          </button>
        </div>
      </div>
      <div className={styles.slider}>
        <div
          ref={trackRef}
          className={styles.track}
          onScroll={updateEdges}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
        >
          {cards.map((c, i) => (
            <ProjectCard key={c.key} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. Cómo trabajamos (≈ El observatorio: bloque teaser) ---------- */
export function Process() {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.3);
  return (
    <section id="proceso" ref={ref} data-scene="4" className={`${styles.section} ${styles.process} ${styles.dark} ${seen ? styles.isIn : ''}`}>
      <div className={styles.processHead}>
        <p className={styles.kicker}>Cómo trabajamos</p>
        <h2 className={styles.h2}>
          <Words text="Cuatro pasos, ningún misterio." as="span" effect="rise" className={styles.anWords} once={false} />
        </h2>
      </div>
      <ol className={styles.steps}>
        {process.map((p, i) => (
          <Reveal key={p.step} from="up" delay={0.08 + i * 0.1} once={false} as="li" className={styles.stepItem}>
            <span className={styles.stepNum}>{p.step}</span>
            <h3 className={styles.stepTitle}>{p.title}</h3>
            <p>{p.text}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal from="up" delay={0.2} once={false}>
        <div className={styles.why}>
          <h3 className={styles.whyTitle}>¿Por qué Cappens?</h3>
          <p>
            Porque unimos <strong>capacidad</strong> para construir y <strong>pensamiento</strong> para hacerlo bien: la solución más
            simple que cumple el objetivo, entregada en ciclos cortos y medida con tus propios datos.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- 6. Contacto ---------- */
type Status = 'idle' | 'sending' | 'ok' | 'error';

export function Contact({ onSeen }: { onSeen: () => void }) {
  const [ref, seen] = useInViewOnce<HTMLElement>(0.2);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (seen) onSeen();
  }, [seen, onSeen]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? '') || undefined,
      message: String(data.get('message') ?? ''),
    };
    setStatus('sending');
    try {
      const res = await fetch(contact.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json: unknown = await res.json().catch(() => null);
      const ok = res.ok && typeof json === 'object' && json !== null && (json as { ok?: unknown }).ok === true;
      setStatus(ok ? 'ok' : 'error');
      if (ok) form.reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contacto" ref={ref} data-scene="5" className={`${styles.section} ${styles.contact} ${seen ? styles.isIn : ''}`}>
      <Reveal from="left" delay={0.05} once={false} className={styles.contactInfo}>
        <p className={styles.kicker}>Contacto</p>
        <h2 className={styles.h2}>
          <Words text={contact.title} as="span" effect="rise" className={styles.anWords} once={false} />
        </h2>
        <p className={styles.muted}>{contact.lead}</p>
        <a href={`mailto:${brand.email}`} className={styles.linkArrow}>
          {brand.email} <span aria-hidden="true">→</span>
        </a>
      </Reveal>
      <form className={styles.form} onSubmit={onSubmit}>
        <Reveal from="up" delay={0.08} once={false} className={styles.anFieldWrap}>
          <label className={styles.field}>
            <input name="name" required placeholder=" " autoComplete="name" />
            <span>Nombre</span>
          </label>
        </Reveal>
        <Reveal from="up" delay={0.14} once={false} className={styles.anFieldWrap}>
          <label className={styles.field}>
            <input name="email" type="email" required placeholder=" " autoComplete="email" />
            <span>Email</span>
          </label>
        </Reveal>
        <Reveal from="up" delay={0.2} once={false} className={styles.anFieldWrap}>
          <label className={styles.field}>
            <input name="company" placeholder=" " autoComplete="organization" />
            <span>Empresa (opcional)</span>
          </label>
        </Reveal>
        <Reveal from="up" delay={0.26} once={false} className={styles.anFieldFull}>
          <label className={`${styles.field} ${styles.fieldFull}`}>
            <textarea name="message" required rows={4} placeholder=" " />
            <span>Mensaje</span>
          </label>
        </Reveal>
        <Reveal from="up" delay={0.32} once={false} className={`${styles.formFoot} ${styles.anFieldFull}`}>
          <AnMagnetButton type="submit" className={`${styles.btn} ${styles.btnDark}`} disabled={status === 'sending'}>
            <span>{status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}</span>
          </AnMagnetButton>
          <p className={styles.formStatus} role="status" aria-live="polite">
            {status === 'ok' && 'Gracias. Te contactaremos pronto.'}
            {status === 'error' && 'Algo falló al enviar. Inténtalo de nuevo en un momento.'}
          </p>
        </Reveal>
      </form>
    </section>
  );
}
