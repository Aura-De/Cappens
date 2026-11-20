'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { CrmPreview } from '@/app/maquetas/_crm/CrmPreview';
import { EmployeeAvatar } from '@/app/maquetas/_crm/EmployeeAvatar';
import { Reveal, range, smooth, usePrefersReducedMotion, useScrollProgress } from '@/app/maquetas/_motion/motion';
import { stackTools } from '@/lib/maquetas/content';
import { employees, story, storyFinale } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

function Marquee() {
  const items = useMemo(() => [...stackTools, ...stackTools, ...stackTools], []);
  return (
    <div className={styles.ncMarquee} aria-label="Integraciones">
      <div className={styles.ncMarqueeTrack}>
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className={styles.ncChip} aria-hidden={i >= stackTools.length}>
            <i aria-hidden="true" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function TeamOverlay({ show }: { show: number }) {
  const crew = employees.filter((e) => e.id !== 'nuevo').slice(0, 5);
  return (
    <div className={styles.ncStoryCrew} style={{ opacity: show }} aria-hidden={show < 0.15}>
      {crew.map((e, i) => (
        <span
          key={e.id}
          className={styles.ncStoryCrewItem}
          style={{ ['--i' as string]: String(i), transform: `translateY(${(1 - show) * (8 + i * 4)}px)` }}
        >
          <EmployeeAvatar id={e.id} name={e.name} size={36} working={show > 0.5} />
        </span>
      ))}
    </div>
  );
}

export function Story() {
  const ref = useRef<HTMLElement | null>(null);
  const [compact, setCompact] = useState(false);
  const reduced = usePrefersReducedMotion();
  const staticStory = compact || reduced;
  const p = useScrollProgress(ref, { enabled: !staticStory });
  useEffect(() => {
    const query = window.matchMedia('(max-width: 860px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const progress = staticStory ? 1 : p;
  const beatSpan = 0.76;
  const crmProgress = staticStory ? 1 : range(progress, 0.02, 0.78);
  const wash = staticStory ? 0 : smooth(range(progress, 0.78, 0.9));
  const finale = staticStory ? 1 : wash >= 0.22 ? 1 : 0;
  const marquee = staticStory ? 1 : smooth(range(progress, 0.88, 1));
  const crewShow = staticStory ? 1 : smooth(range(progress, 0.5, 0.72));
  const beatOut = staticStory ? 0 : wash;

  const beatStates = story.map((beat, index) => {
    const pad = 0.1;
    const start = Math.max(0, (index / story.length) * beatSpan - pad);
    const end = Math.min(0.82, ((index + 1) / story.length) * beatSpan + pad);
    const local = range(progress, start, end);
    let peak: number;
    if (index === 0) {
      peak = local <= 0.72 ? 1 : Math.max(0, 1 - (local - 0.72) * 5);
    } else {
      peak = Math.max(0, 1 - Math.abs(local - 0.5) * 2.05);
    }
    return { beat, index, local, score: peak * (1 - beatOut) };
  });
  const bestScore = Math.max(0, ...beatStates.map((b) => b.score));
  const activeIndex =
    staticStory || bestScore < 0.35 || finale > 0
      ? -1
      : beatStates.reduce((best, cur) => (cur.score > beatStates[best].score ? cur.index : best), 0);

  return (
    <section
      id="story"
      ref={ref}
      data-static={staticStory}
      className={styles.ncStory}
      aria-label="Cómo funciona Cappens"
    >
      <div className={styles.ncStoryPin}>
        <div className={styles.ncStoryWash} style={{ opacity: wash }} aria-hidden="true" />
        <div className={styles.ncStoryLayout}>
          <div className={styles.ncStoryRail}>
            {beatStates.map(({ beat, index, local }) => {
              const on = staticStory || index === activeIndex;
              const opacity = on ? 1 : 0;
              const y = staticStory ? 0 : (0.5 - local) * 18;
              const body = (
                <>
                  <span className={styles.ncKicker}>{beat.kicker}</span>
                  <h2>{beat.title}</h2>
                  <p>{beat.text}</p>
                </>
              );
              if (staticStory) {
                return (
                  <Reveal key={beat.id} from="up" delay={index * 0.08} once>
                    <article className={styles.ncBeat}>{body}</article>
                  </Reveal>
                );
              }
              return (
                <article
                  key={beat.id}
                  className={styles.ncBeat}
                  style={{
                    opacity,
                    transform: `translate3d(0, calc(-50% + ${y}px), 0)`,
                    filter: 'none',
                  }}
                  aria-hidden={!on}
                >
                  {body}
                </article>
              );
            })}
          </div>
          <div className={styles.ncStoryDevice}>
            {staticStory ? (
              <Reveal from="up" delay={0.2} once className={styles.ncStoryCard}>
                <CrmPreview progress={1} />
                <TeamOverlay show={1} />
              </Reveal>
            ) : (
              <div
                className={styles.ncStoryCard}
                style={
                  {
                    transform: `scale(${1 + wash * 0.1})`,
                    '--chrome': String(1 - wash * 0.85),
                  } as CSSProperties
                }
              >
                <CrmPreview progress={crmProgress} />
                <TeamOverlay show={finale ? 0 : crewShow * (1 - wash)} />
              </div>
            )}
          </div>
        </div>

        {staticStory ? (
          <Reveal from="up" delay={0.28} once className={styles.ncFinale}>
            <h2>
              <em>{storyFinale.title}</em>
            </h2>
            <p>{storyFinale.text}</p>
            <div className={styles.ncFinaleCrew}>
              {employees
                .filter((e) => e.id !== 'nuevo')
                .map((e) => (
                  <EmployeeAvatar key={e.id} id={e.id} name={e.name} size={40} working />
                ))}
            </div>
          </Reveal>
        ) : (
          <div
            className={styles.ncFinale}
            style={{
              opacity: finale,
              transform: `translate(-50%, ${(1 - finale) * 20}px)`,
            }}
            aria-hidden={finale < 0.2}
          >
            <h2>
              <em>{storyFinale.title}</em>
            </h2>
            <p>{storyFinale.text}</p>
            <div className={styles.ncFinaleCrew}>
              {employees
                .filter((e) => e.id !== 'nuevo')
                .map((e) => (
                  <EmployeeAvatar key={e.id} id={e.id} name={e.name} size={40} working />
                ))}
            </div>
          </div>
        )}

        <div className={styles.ncMarqueeWrap} style={{ opacity: marquee }} aria-hidden={marquee < 0.15}>
          <Marquee />
        </div>
      </div>
    </section>
  );
}
