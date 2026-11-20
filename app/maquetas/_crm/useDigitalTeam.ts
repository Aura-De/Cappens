'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { DemoState } from './data';
import { applyPlan, nextPlan } from './team';
import { useReducedMotion } from './hooks';

export type EmployeeGhost = { employeeId: string; dealId: string; startX: number; startY: number; fromX: number; fromY: number; toX: number; toY: number; width: number; duration: number };

export function useDigitalTeam(state: DemoState, setState: Dispatch<SetStateAction<DemoState>>, host: RefObject<HTMLDivElement | null>, view: string, beforeMove: () => void, blocked = false) {
  const current = useRef({ state, view, beforeMove });
  current.current = { state, view, beforeMove };
  const sequence = useRef(0);
  const version = useRef(state.teamVersion);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [ghost, setGhost] = useState<EmployeeGhost | null>(null);
  const reduced = useReducedMotion();
  const enabled = state.team.filter(employee => employee.active).map(employee => employee.id).join('|');
  useEffect(() => {
    setWorkingId(null); setGhost(null);
    if (version.current !== state.teamVersion) { sequence.current = 0; version.current = state.teamVersion; }
    if (state.teamPaused || !enabled || blocked) return;
    let finish = 0;
    let busy = false;
    const tick = () => {
      if (busy || document.hidden || host.current?.querySelector('[data-crm-dragging="true"]')) return;
      const snapshot = current.current;
      const job = nextPlan(snapshot.state, sequence.current);
      if (!job) return;
      sequence.current = job.next;
      const plan = job.plan;
      busy = true;
      setWorkingId(plan.employeeId);
      let duration = reduced ? 260 : 1000;
      if (plan.kind === 'move' && snapshot.view === 'pipeline') {
        const element = host.current;
        const card = element?.querySelector<HTMLElement>(`[data-crm-card="${plan.dealId}"]`);
        const column = element?.querySelector<HTMLElement>(`[data-crm-stage="${plan.toStage}"]`);
        if (element && card && column) {
          const bounds = element.getBoundingClientRect();
          const board = element.querySelector<HTMLElement>('[data-crm-board]');
          // Keep both endpoints inside the visible board. Its own scroll never moves the page.
          if (board) {
            const boardBounds = board.getBoundingClientRect();
            const left = Math.min(card.getBoundingClientRect().left, column.getBoundingClientRect().left) - boardBounds.left + board.scrollLeft;
            board.scrollLeft = Math.max(0, left - 20);
          }
          const origin = card.getBoundingClientRect();
          const target = column.getBoundingClientRect();
          const scale = bounds.width / Math.max(1, element.offsetWidth);
          const boardRect = board?.getBoundingClientRect();
          const targetX = boardRect ? Math.min(target.left + 12, boardRect.right - origin.width - 8) : target.left + 12;
          duration = reduced ? 260 : 1700;
          setGhost({ employeeId: plan.employeeId, dealId: plan.dealId, startX: (bounds.width - 90) / scale, startY: 90, fromX: (origin.left - bounds.left) / scale, fromY: (origin.top - bounds.top) / scale, toX: Math.max(10, (targetX - bounds.left) / scale), toY: (target.top - bounds.top + 70) / scale, width: origin.width / scale, duration });
        }
      }
      finish = window.setTimeout(() => {
        if (plan.kind === 'move') current.current.beforeMove();
        setState(previous => applyPlan(previous, plan));
        if (plan.kind === 'move' && current.current.view === 'pipeline') {
          const board = host.current?.querySelector<HTMLElement>('[data-crm-board]');
          const column = host.current?.querySelector<HTMLElement>(`[data-crm-stage="${plan.toStage}"]`);
          if (board && column) board.scrollBy({ left: column.getBoundingClientRect().left - board.getBoundingClientRect().left - 12, behavior: reduced ? 'auto' : 'smooth' });
        }
        setWorkingId(null); setGhost(null); busy = false;
      }, duration);
    };
    const interval = window.setInterval(tick, 3600);
    return () => { clearInterval(interval); clearTimeout(finish); };
  }, [state.teamPaused, state.teamVersion, enabled, reduced, blocked, host, setState]);
  useEffect(() => { setGhost(null); }, [view]);
  return { workingId, ghost };
}
