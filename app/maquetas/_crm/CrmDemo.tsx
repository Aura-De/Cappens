'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { brand } from '@/lib/maquetas/content';
import { modules } from '@/lib/maquetas/product';
import { CustomizePanel } from './CustomizePanel';
import type { PanelMode } from './CustomizePanel';
import { CrmIcon } from './CrmIcon';
import { currency, initialState, initials, moduleGlyphs, newId } from './data';
import type { CustomField, Deal, ModuleId } from './data';
import { useCountUp, useReducedMotion } from './hooks';
import { EmployeeAvatar } from './EmployeeAvatar';
import { TeamPanel } from './TeamPanel';
import { ActivityPanel } from './ActivityPanel';
import { useDigitalTeam } from './useDigitalTeam';
import { resolveApproval } from './team';
import s from './crm.module.css';

type DragSession = {
  id: string; pointerId: number; startX: number; startY: number; x: number; y: number;
  offsetX: number; offsetY: number; width: number; active: boolean; target: string | null;
};

function AnimatedAmount({ amount, reduced }: { amount: number; reduced: boolean }) {
  const value = useCountUp(amount, reduced);
  return <span><span className={s.crmSrOnly}>{currency.format(amount)}</span><span aria-hidden="true">{currency.format(value)}</span></span>;
}

function DealContent({ deal, fields, ownerName = 'Teo' }: { deal: Deal; fields: CustomField[]; ownerName?: string }) {
  return <><div className={s.crmCardCompany}><span className={s.crmCompanyAvatar}>{initials(deal.company)}</span><strong>{deal.company}</strong></div><p className={s.crmCardContact}>{deal.contact}</p><div className={s.crmCardBottom}><span>{currency.format(deal.value)}</span><span className={s.crmDealOwner}><EmployeeAvatar id={deal.employeeId ?? 'teo'} name={ownerName} size={16} />{ownerName}</span></div>{deal.proposal && <span className={s.crmProposalChip}><CrmIcon name="document" /> Presupuesto adjunto</span>}{fields.length > 0 && <div className={s.crmCardFields}>{fields.map(field => <span className={s.crmCustomChip} key={field.id} title={`${field.name}: ${deal.fields[field.id] || 'Sin completar'}`}>{field.name}: {deal.fields[field.id] || '—'}</span>)}</div>}</>;
}

function TeamMetrics({ completed, minutes, reduced }: { completed: number; minutes: number; reduced: boolean }) {
  const tasks = useCountUp(completed, reduced);
  const hours = useCountUp(minutes / 60, reduced);
  return <div className={s.crmTeamMetrics}><span><CrmIcon name="check" /><strong data-crm-metric="tasks">{Math.round(tasks)}</strong> Tareas hechas hoy</span><span><CrmIcon name="chart" /><strong data-crm-metric="hours">{hours.toLocaleString('es-ES', { maximumFractionDigits: 1 })} h</strong> Horas ahorradas</span><span className={s.crmMetricHint}>TU EQUIPO DIGITAL, EN ACCIÓN</span></div>;
}

export default function CrmDemo() {
  const [state, setState] = useState(initialState);
  const [view, setView] = useState<ModuleId | 'equipo'>('pipeline');
  const [panel, setPanel] = useState<PanelMode | null>(null);
  const [search, setSearch] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ stageId: string; key: number } | null>(null);
  const [activityExpanded, setActivityExpanded] = useState(true);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const session = useRef<DragSession | null>(null);
  const dragFrame = useRef(0);
  const rectangles = useRef(new Map<string, DOMRect>());
  const animations = useRef<Animation[]>([]);
  const opener = useRef<HTMLButtonElement | null>(null);
  const pendingFocus = useRef<{ id: string; direction: number } | null>(null);

  function captureLayout() {
    const next = new Map<string, DOMRect>();
    host.current?.querySelectorAll<HTMLElement>('[data-crm-card]').forEach(el => {
      if (el.dataset.crmCard) next.set(el.dataset.crmCard, el.getBoundingClientRect());
    });
    rectangles.current = next;
  }
  const { workingId, ghost: employeeGhost } = useDigitalTeam(state, setState, host, view, captureLayout, draggedId !== null || panel !== null);

  useLayoutEffect(() => {
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    const before = rectangles.current;
    if (before.size) {
      host.current?.querySelectorAll<HTMLElement>('[data-crm-card]').forEach(el => {
        const old = before.get(el.dataset.crmCard ?? '');
        if (!old) return;
        const next = el.getBoundingClientRect();
        const scale = el.offsetWidth ? next.width / el.offsetWidth : 1;
        const dx = (old.left - next.left) / (scale || 1);
        const dy = (old.top - next.top) / (scale || 1);
        if (Math.abs(dx) + Math.abs(dy) > 1 && typeof el.animate === 'function') {
          animations.current.push(el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], { duration: reduced ? 90 : 420, easing: 'cubic-bezier(.16,1,.3,1)' }));
        }
      });
      rectangles.current.clear();
    }
    const focus = pendingFocus.current;
    if (focus) {
      const card = host.current?.querySelector<HTMLElement>(`[data-crm-card="${focus.id}"]`);
      const arrow = card?.querySelector<HTMLButtonElement>(`[data-crm-direction="${focus.direction}"]:not(:disabled)`);
      (arrow ?? card)?.focus({ preventScroll: true });
      card?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
      pendingFocus.current = null;
    }
  }, [state.deals, state.fields, reduced]);

  useEffect(() => () => {
    cancelAnimationFrame(dragFrame.current);
    animations.current.forEach(animation => animation.cancel());
  }, []);

  useEffect(() => {
    if (!celebration) return;
    const timeout = window.setTimeout(() => setCelebration(null), reduced ? 180 : 950);
    return () => clearTimeout(timeout);
  }, [celebration, reduced]);

  function closePanel() {
    setPanel(null);
    opener.current?.focus({ preventScroll: true });
  }

  function openPanel(mode: PanelMode, button: HTMLButtonElement) {
    cancelDrag();
    opener.current = button;
    setPanel(mode);
  }

  function moveDeal(id: string, stageId: string, keyboardDirection?: number) {
    const deal = state.deals.find(item => item.id === id);
    const stage = state.stages.find(item => item.id === stageId);
    if (!deal || !stage || deal.stageId === stageId) return;
    captureLayout();
    pendingFocus.current = { id, direction: keyboardDirection ?? 0 };
    setState(current => ({ ...current, deals: current.deals.map(item => item.id === id ? { ...item, stageId } : item) }));
    setAnnouncement(`${deal.company} movida a ${stage.name}.`);
    // The won stage keeps its identity even when the client renames it.
    if (stageId === 'stage-3') setCelebration({ stageId, key: Date.now() });
  }

  function cancelDrag() {
    session.current = null;
    cancelAnimationFrame(dragFrame.current);
    dragFrame.current = 0;
    setDraggedId(null);
    setDropTarget(null);
  }

  function getDropTarget(x: number, y: number) {
    const surface = board.current;
    const under = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-crm-stage]');
    return under && surface?.contains(under) ? under.dataset.crmStage ?? null : null;
  }

  function dragLoop() {
    const current = session.current;
    const element = host.current;
    if (!current?.active || !element) return;
    const rect = element.getBoundingClientRect();
    const scale = element.offsetWidth ? rect.width / element.offsetWidth : 1;
    if (ghost.current) {
      ghost.current.style.width = `${current.width / (scale || 1)}px`;
      ghost.current.style.transform = `translate3d(${(current.x - rect.left - current.offsetX) / (scale || 1)}px, ${(current.y - rect.top - current.offsetY) / (scale || 1)}px, 0) rotate(${reduced ? 0 : -2}deg)`;
    }
    const surface = board.current;
    if (surface) {
      const bounds = surface.getBoundingClientRect();
      const withinY = current.y >= bounds.top - 15 && current.y <= bounds.bottom + 15;
      if (withinY && current.x < bounds.left + 48 && current.x > bounds.left - 24) surface.scrollLeft -= 10;
      if (withinY && current.x > bounds.right - 48 && current.x < bounds.right + 24) surface.scrollLeft += 10;
      const target = getDropTarget(current.x, current.y);
      if (target !== current.target) { current.target = target; setDropTarget(target); }
    }
    dragFrame.current = requestAnimationFrame(dragLoop);
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>, deal: Deal) {
    if (event.button !== 0 || session.current) return;
    const card = event.currentTarget.closest<HTMLElement>('[data-crm-card]');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    session.current = { id: deal.id, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, y: event.clientY, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top, width: rect.width, active: false, target: null };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus({ preventScroll: true });
  }

  function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const current = session.current;
    if (!current || current.pointerId !== event.pointerId) return;
    current.x = event.clientX;
    current.y = event.clientY;
    if (!current.active && Math.hypot(current.x - current.startX, current.y - current.startY) > 5) {
      current.active = true;
      setDraggedId(current.id);
      setAnnouncement('Arrastrando oportunidad. Suelta sobre una etapa; Escape cancela.');
      dragFrame.current = requestAnimationFrame(dragLoop);
    }
  }

  function pointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const current = session.current;
    if (!current || current.pointerId !== event.pointerId) return;
    // A pointerup can arrive before the next rAF updates the highlighted column.
    const target = getDropTarget(event.clientX, event.clientY);
    if (current.active && target) moveDeal(current.id, target);
    else if (current.active) setAnnouncement('Movimiento cancelado. La oportunidad conserva su etapa.');
    cancelDrag();
  }

  function toggleModule(id: ModuleId) {
    if (id === 'contactos') return;
    const enabled = state.activeModules.includes(id);
    if (enabled && view === id) setView('contactos');
    setState(current => ({ ...current, activeModules: enabled ? current.activeModules.filter(item => item !== id) : [...current.activeModules, id] }));
    setAnnouncement(`${modules.find(item => item.id === id)?.name ?? id}: ${enabled ? 'desactivado' : 'activado'}.`);
  }

  function renameStage(id: string, name: string) {
    if (!name || name.length > 28 || state.stages.some(item => item.id !== id && item.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) return false;
    if (state.stages.find(item => item.id === id)?.name === name) return true;
    setState(current => ({ ...current, stages: current.stages.map(item => item.id === id ? { ...item, name } : item) }));
    return true;
  }

  function addStage(name: string) {
    if (!name || name.length > 28 || state.stages.some(item => item.name.toLocaleLowerCase('es') === name.toLocaleLowerCase('es'))) return false;
    const id = newId('stage');
    setState(current => ({ ...current, stages: [...current.stages, { id, name }] }));
    setAnnouncement(`Etapa ${name} añadida al pipeline.`);
    return true;
  }

  function addField(field: Omit<CustomField, 'id'>) {
    if (!field.name || field.name.length > 28 || state.fields.some(item => item.name.toLocaleLowerCase('es') === field.name.toLocaleLowerCase('es'))) return false;
    captureLayout();
    const id = newId('field');
    setState(current => ({ ...current, fields: [...current.fields, { ...field, id }] }));
    setAnnouncement(`Campo ${field.name} añadido. Edítalo en Contactos.`);
    return true;
  }

  function addDeal(company: string, person: string, value: number) {
    captureLayout();
    const deal: Deal = { id: newId('deal'), company, contact: person, value, stageId: state.stages[0].id, fields: {}, employeeId: 'teo' };
    pendingFocus.current = { id: deal.id, direction: 1 };
    setState(current => ({ ...current, deals: [...current.deals, deal], activeModules: current.activeModules.includes('pipeline') ? current.activeModules : [...current.activeModules, 'pipeline'] }));
    setView('pipeline');
    setPanel(null);
    setAnnouncement(`Nueva oportunidad: ${company}, ${currency.format(value)}.`);
  }

  function resetDemo() {
    cancelDrag();
    setState(previous => ({ ...initialState(), teamVersion: previous.teamVersion + 1 })); setView('pipeline'); setSearch(''); setPanel(null); setCelebration(null); setSelectedContact(null);
    setAnnouncement('Demo restablecida. Se han recuperado los datos de ejemplo.');
  }

  const activeModule = view === 'equipo' ? { name: 'Equipo digital', desc: 'Compañeros que trabajan dentro de tu CRM. Tú decides qué hacen.' } : modules.find(item => item.id === view) ?? modules[1];
  const dragged = state.deals.find(item => item.id === draggedId);
  const filtered = state.deals.filter(item => `${item.company} ${item.contact} ${Object.values(item.fields).join(' ')}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')));
  const pipelineTotal = state.deals.reduce((sum, item) => sum + item.value, 0);
  const wonTotal = state.deals.filter(item => item.stageId === 'stage-3').reduce((sum, item) => sum + item.value, 0);
  const completed = state.tasks.filter(item => item.done).length;
  const contactDeal = state.deals.find(deal => deal.id === selectedContact);
  const employeeDeal = state.deals.find(deal => deal.id === employeeGhost?.dealId);
  const ghostEmployee = state.team.find(employee => employee.id === employeeGhost?.employeeId);
  function decideApproval(id: string, approved: boolean) {
    const request = state.events.find(event => event.id === id && event.status === 'pending');
    if (!request) return;
    captureLayout();
    if (approved) pendingFocus.current = { id: request.dealId, direction: 0 };
    setState(previous => resolveApproval(previous, id, approved));
    if (approved) { setView('pipeline'); setCelebration({ stageId: 'stage-3', key: Date.now() }); }
    setAnnouncement(approved ? 'Propuesta aprobada y oportunidad ganada.' : 'Propuesta rechazada. No se ha cambiado la etapa.');
  }

  return <div ref={host} className={s.crm} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={() => { if (session.current) cancelDrag(); }} onKeyDown={event => {
    if (event.key === 'Escape') {
      if (session.current) { cancelDrag(); setAnnouncement('Movimiento cancelado.'); }
      else if (panel) closePanel();
    }
  }}>
    <div className={s.crmWindowBar}><span className={s.crmWindowDots} aria-hidden="true"><i /><i /><i /></span><span className={s.crmWindowAddress}><span aria-hidden="true">◇</span> app.cappens.io</span><span className={s.crmWindowBadge}>DEMO INTERACTIVA</span></div>
    <div className={s.crmAppLayout}>
      <aside className={s.crmSidebar} aria-label="Módulos del CRM"><div className={s.crmWorkspace}><img src={brand.logo.mark} alt="" /><div><strong>{brand.name}</strong><span>Tu espacio de trabajo</span></div><span className={s.crmWorkspaceChevron} aria-hidden="true">⌄</span></div><span className={s.crmSidebarCaption}>TU NEGOCIO</span><nav className={s.crmModuleNav} aria-label="Vistas del CRM"><button type="button" className={s.crmModuleButton} aria-current={view === 'equipo' ? 'page' : undefined} onClick={() => { cancelDrag(); setView('equipo'); }}><CrmIcon name="contacts" /><span>Equipo</span><small>{state.team.length}</small></button>{modules.map(item => {
        const active = state.activeModules.includes(item.id);
        return <div key={item.id} className={s.crmModuleSlot} data-active={active} aria-hidden={!active}><div><button type="button" tabIndex={active ? 0 : -1} disabled={!active} className={s.crmModuleButton} aria-current={view === item.id ? 'page' : undefined} onClick={() => { cancelDrag(); setView(item.id); }}><CrmIcon name={moduleGlyphs[item.id]} /><span>{item.name}</span>{item.id === 'pipeline' && <small>{state.deals.length}</small>}{item.id === 'tareas' && <small>{state.tasks.length - completed}</small>}</button></div></div>;
      })}</nav><div className={s.crmSidebarBottom}><div className={s.crmSidebarTip}><CrmIcon name="spark" /><p>Menos ruido.<br /><strong>Más a tu medida.</strong></p></div><span className={s.crmUserAvatar}>CP</span><div><strong>Equipo Cappens</strong><span>Espacio de ejemplo</span></div></div></aside>
      <div className={s.crmMainArea}>
        <div className={s.crmAppHeader}><div className={s.crmBreadcrumb}><span>Mi espacio</span><span aria-hidden="true">/</span><strong>{activeModule.name}</strong></div><button type="button" className={s.crmCustomizeButton} aria-expanded={panel === 'customize'} onClick={event => openPanel('customize', event.currentTarget)}><CrmIcon name="settings" /><span>Personalizar</span></button></div>
        <TeamMetrics completed={state.metrics.completed} minutes={state.metrics.savedMinutes} reduced={reduced} /><div className={s.crmViewHeading}><div><span className={s.crmEyebrow}>CAPPENS / TU EQUIPO + TU CRM</span><h2>{view === 'pipeline' ? 'Cada oportunidad cuenta.' : view === 'contactos' ? 'Personas, no filas.' : view === 'tareas' ? 'Lo siguiente, más claro.' : activeModule.name}</h2><p>{view === 'pipeline' ? 'De la primera conversación a un nuevo sí.' : view === 'contactos' ? 'Todo tu contexto, justo donde lo necesitas.' : view === 'tareas' ? 'Un pequeño paso. Una cosa menos en la cabeza.' : activeModule.desc}</p></div><button type="button" className={s.crmPrimaryButton} onClick={event => openPanel('deal', event.currentTarget)}><CrmIcon name="plus" /><span>Nueva oportunidad</span></button></div>

        {view === 'equipo' ? <TeamPanel state={state} setState={setState} workingId={workingId} /> : view === 'pipeline' ? <div className={s.crmPipelineView}>
          <div className={s.crmPipelineToolbar}><div className={s.crmViewTabs}><span><CrmIcon name="pipeline" /> Vista tablero</span><span className={s.crmPipelineCount}>{state.deals.length} oportunidades</span></div><span className={s.crmPipelineValue}>En el pipeline <strong><AnimatedAmount amount={pipelineTotal} reduced={reduced} /></strong></span></div>
          <p className={s.crmDragHint}><CrmIcon name="grip" /><span>Arrastra desde el tirador · o mueve con los botones ← / → de cada tarjeta.</span></p>
          <div ref={board} data-crm-board className={s.crmBoard} tabIndex={0} role="region" aria-label="Tablero de oportunidades, desplazamiento horizontal">
            {state.stages.map((stage, index) => {
              const deals = state.deals.filter(item => item.stageId === stage.id);
              const total = deals.reduce((sum, item) => sum + item.value, 0);
              const won = stage.id === 'stage-3';
              return <div className={s.crmColumn} key={stage.id} data-crm-stage={stage.id} data-drop={dropTarget === stage.id} data-won={won}>
                <div className={s.crmColumnHeading}><div><span className={s.crmStageDot} /><h3>{stage.name}</h3><span className={s.crmColumnCount}>{deals.length}</span></div><AnimatedAmount amount={total} reduced={reduced} /></div>
                <div className={s.crmColumnCards}>{deals.map(deal => <article key={deal.id} data-crm-card={deal.id} data-crm-dragging={draggedId === deal.id} data-digital-dragging={employeeGhost?.dealId === deal.id} data-dragging={draggedId === deal.id} className={s.crmCard} tabIndex={0} aria-label={`${deal.company}, ${currency.format(deal.value)}, ${stage.name}`}>
                  <button type="button" className={s.crmDragHandle} aria-label={`Arrastrar ${deal.company}. Para teclado, usa los botones mover anterior o siguiente.`} onPointerDown={event => startDrag(event, deal)}><CrmIcon name="grip" /></button><DealContent deal={deal} fields={state.fields} ownerName={state.team.find(employee => employee.id === deal.employeeId)?.name} />
                  <div className={s.crmMoveButtons}><button type="button" data-crm-direction="-1" disabled={index === 0} aria-label={`Mover ${deal.company} a ${state.stages[index - 1]?.name ?? 'etapa anterior'}`} onClick={() => moveDeal(deal.id, state.stages[index - 1].id, -1)}>←</button><span>Mover etapa</span><button type="button" data-crm-direction="1" disabled={index === state.stages.length - 1} aria-label={`Mover ${deal.company} a ${state.stages[index + 1]?.name ?? 'etapa siguiente'}`} onClick={() => moveDeal(deal.id, state.stages[index + 1].id, 1)}>→</button></div>
                </article>)}{deals.length === 0 && <div className={s.crmEmptyColumn}><span aria-hidden="true"><CrmIcon name="plus" /></span><p>El próximo paso<br />empieza aquí.</p></div>}</div>
                {celebration?.stageId === stage.id && <div key={celebration.key} className={s.crmCelebration} aria-hidden="true"><span><CrmIcon name="check" /> ¡Un nuevo sí!</span>{Array.from({ length: 9 }, (_, n) => <i key={n} style={{ '--crm-particle': n } as CSSProperties} />)}</div>}
              </div>;
            })}
          </div><div className={s.crmPipelineFoot}><span><span className={s.crmLiveDot} /> Cambios al instante</span><span>Ganado <strong><AnimatedAmount amount={wonTotal} reduced={reduced} /></strong></span></div>
        </div> : view === 'contactos' ? <div className={s.crmContactsView}>
          <div className={s.crmTableToolbar}><label className={s.crmSearch}><CrmIcon name="search" /><input aria-label="Buscar contactos, empresas o campos personalizados" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar personas o empresas…" type="search" /></label><span aria-live="polite">{filtered.length} contactos</span></div>
          {contactDeal && <div className={s.crmContactHistory}><div><span className={s.crmEyebrow}>HISTORIAL DEL CLIENTE</span><h3>{contactDeal.company} · {contactDeal.contact}</h3><button type="button" className={s.crmIconButton} aria-label="Cerrar ficha" onClick={() => setSelectedContact(null)}><CrmIcon name="close" /></button></div><div className={s.crmContactFacts}><span>{state.notes.filter(note => note.dealId === contactDeal.id).length} notas</span><span>{state.meetings.filter(meeting => meeting.dealId === contactDeal.id).length} reuniones</span><span>Cobros: {currency.format(state.payments.filter(payment => payment.dealId === contactDeal.id && payment.paid).reduce((sum, payment) => sum + payment.amount, 0))}</span></div>{state.notes.filter(note => note.dealId === contactDeal.id).length === 0 && <p>Aún no hay acciones registradas para este cliente.</p>}{state.notes.filter(note => note.dealId === contactDeal.id).slice(0, 8).map(note => <p className={s.crmContactNote} key={note.id}><EmployeeAvatar id={note.employeeId} name={state.team.find(employee => employee.id === note.employeeId)?.name ?? 'Equipo'} size={22} /><span>{note.text}</span></p>)}</div>}
          <div className={s.crmTableScroll} role="region" aria-label="Tabla de contactos, desplazamiento horizontal" tabIndex={0}><table className={s.crmContactTable}><thead><tr><th scope="col">Contacto</th><th scope="col">Empresa</th><th scope="col">Etapa</th><th scope="col">Oportunidad</th>{state.fields.map(field => <th scope="col" key={field.id}>{field.name}<small>{field.type === 'numero' ? 'Número' : field.type === 'fecha' ? 'Fecha' : field.type === 'selector' ? 'Selector' : 'Texto'}</small></th>)}</tr></thead><tbody>{filtered.map((deal, index) => <tr key={deal.id} style={{ '--crm-order': Math.min(index, 8) } as CSSProperties}><td><span className={s.crmContactPerson}><span className={s.crmCompanyAvatar}>{initials(deal.contact)}</span><button type="button" className={s.crmContactOpen} onClick={() => setSelectedContact(deal.id)}>{deal.contact}</button></span></td><td>{deal.company}</td><td><span className={s.crmTableStage} data-won={deal.stageId === 'stage-3'}>{state.stages.find(stage => stage.id === deal.stageId)?.name}</span></td><td>{currency.format(deal.value)}</td>{state.fields.map(field => <td key={field.id}>{field.type === 'selector' ? <select className={s.crmCellInput} aria-label={`${field.name} de ${deal.contact}`} value={deal.fields[field.id] ?? ''} onChange={event => {
            const value = event.target.value;
            setState(current => ({ ...current, deals: current.deals.map(item => item.id === deal.id ? { ...item, fields: { ...item.fields, [field.id]: value } } : item) }));
          }}><option value="">Sin completar</option>{field.options.map(option => <option key={option} value={option}>{option}</option>)}</select> : <input className={s.crmCellInput} aria-label={`${field.name} de ${deal.contact}`} type={field.type === 'numero' ? 'number' : field.type === 'fecha' ? 'date' : 'text'} step={field.type === 'numero' ? 'any' : undefined} value={deal.fields[field.id] ?? ''} placeholder="Sin completar" onChange={event => {
            const value = event.target.value;
            setState(current => ({ ...current, deals: current.deals.map(item => item.id === deal.id ? { ...item, fields: { ...item.fields, [field.id]: value } } : item) }));
          }} />}</td>)}</tr>)}</tbody></table>{filtered.length === 0 && <div className={s.crmNoResults}><CrmIcon name="search" /><strong>No encontramos coincidencias.</strong><p>Prueba con otro nombre, empresa o valor de campo.</p><button type="button" className={s.crmSecondaryButton} onClick={() => setSearch('')}>Limpiar búsqueda</button></div>}</div>
        </div> : view === 'tareas' ? <div className={s.crmTasksView}><div className={s.crmTasksSummary}><div><CrmIcon name="tasks" /><strong>Tu próxima pequeña victoria</strong></div><span>{completed} de {state.tasks.length} completadas</span><div className={s.crmTasksProgress}><span style={{ transform: `scaleX(${completed / state.tasks.length})` }} /></div></div>{state.tasks.map((task, index) => <label key={task.id} className={s.crmTaskRow} data-done={task.done} style={{ '--crm-order': index } as CSSProperties}><input type="checkbox" checked={task.done} onChange={() => setState(current => ({ ...current, tasks: current.tasks.map(item => item.id === task.id ? { ...item, done: !item.done } : item) }))} /><span className={s.crmTaskCheckbox} aria-hidden="true"><CrmIcon name="check" /></span><span className={s.crmTaskText}><strong>{task.title}</strong><small>{task.company}</small></span><span className={s.crmTaskDue}>{task.done ? 'Hecho' : task.due}</span></label>)}</div> : <div key={view} className={s.crmModulePlaceholder}><span className={s.crmModuleLargeIcon}><CrmIcon name={moduleGlyphs[view]} /></span><span className={s.crmEnabledBadge}><span className={s.crmLiveDot} /> Módulo activado</span><h3>{activeModule.name}</h3><p>{activeModule.desc}</p><div className={s.crmSkeletonGrid} aria-hidden="true">{[0, 1, 2].map(index => <div key={index}><span /><span /><span /></div>)}</div><p className={s.crmPlaceholderNote}>Vista ilustrativa. Este módulo está listo para configurarse a tu medida.</p></div>}
      </div>
      <ActivityPanel state={state} workingId={workingId} expanded={activityExpanded} onExpand={() => setActivityExpanded(!activityExpanded)} onToggle={() => setState(previous => ({ ...previous, teamPaused: !previous.teamPaused }))} onApproval={decideApproval} onContact={id => { cancelDrag(); setView('contactos'); setSearch(''); setSelectedContact(id); }} />
    </div>
    <div className={s.crmDemoFooter}><span><span className={s.crmDemoDot} /> Datos ficticios · Cambios solo en esta sesión</span><button type="button" onClick={resetDemo}><CrmIcon name="reset" /><span>Restablecer demo</span></button></div>
    {panel && <CustomizePanel mode={panel} state={state} onClose={closePanel} onToggle={toggleModule} onRename={renameStage} onStage={addStage} onField={addField} onDeal={addDeal} />}
    {dragged && <div ref={ghost} className={`${s.crmCard} ${s.crmDragGhost}`} aria-hidden="true"><DealContent deal={dragged} fields={state.fields} /></div>}
    {employeeGhost && employeeDeal && ghostEmployee && <div className={s.crmEmployeeGhostLayer} aria-hidden="true" style={{ '--crm-ghost-start-x': `${employeeGhost.startX}px`, '--crm-ghost-start-y': `${employeeGhost.startY}px`, '--crm-ghost-from-x': `${employeeGhost.fromX}px`, '--crm-ghost-from-y': `${employeeGhost.fromY}px`, '--crm-ghost-to-x': `${employeeGhost.toX}px`, '--crm-ghost-to-y': `${employeeGhost.toY}px`, '--crm-ghost-duration': `${employeeGhost.duration}ms` } as CSSProperties}><div className={s.crmEmployeeDragCard} style={{ width: employeeGhost.width }}><DealContent deal={employeeDeal} fields={state.fields} ownerName={ghostEmployee.name} /></div><div className={s.crmEmployeeCursor}><span><CrmIcon name="cursor" /></span><EmployeeAvatar id={ghostEmployee.id} name={ghostEmployee.name} size={28} working /><strong>{ghostEmployee.name}</strong></div></div>}
    <p className={s.crmSrOnly} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </div>;
}
