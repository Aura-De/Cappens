'use client';

import type { DemoState } from './data';
import { EmployeeAvatar } from './EmployeeAvatar';
import { CrmIcon } from './CrmIcon';
import s from './crm.module.css';

export function ActivityPanel({ state, workingId, expanded, onExpand, onToggle, onApproval, onContact }: { state: DemoState; workingId: string | null; expanded: boolean; onExpand: () => void; onToggle: () => void; onApproval: (id: string, approved: boolean) => void; onContact: (id: string) => void }) {
  const pending = state.events.filter(event => event.status === 'pending').length;
  return <aside className={s.crmActivityPanel} data-expanded={expanded} aria-label="Actividad del equipo digital">
    <div className={s.crmActivityHeading}><button type="button" className={s.crmActivityToggle} aria-expanded={expanded} onClick={onExpand}><span className={s.crmLiveDot} /><strong>En tu CRM, ahora</strong>{pending > 0 && <span className={s.crmPendingCount}>{pending}</span>}<span className={s.crmActivityChevron} aria-hidden="true">⌄</span></button><button type="button" className={s.crmTeamPause} onClick={onToggle} aria-label={state.teamPaused ? 'Reanudar equipo digital' : 'Pausar equipo digital'}>{state.teamPaused ? '▶ Reanudar' : 'Ⅱ Pausar'}</button></div>
    <div className={s.crmActivityContents}><div className={s.crmActivityState}><span>{state.teamPaused ? 'Equipo pausado. Tú tienes el control.' : workingId ? `${state.team.find(employee => employee.id === workingId)?.name ?? 'Tu equipo'} está trabajando…` : 'Cada acción queda en su cliente.'}</span><div className={s.crmActivityFaces}>{state.team.slice(0, 5).map(employee => <EmployeeAvatar key={employee.id} id={employee.id} name={employee.name} size={22} working={employee.id === workingId && !state.teamPaused} />)}</div></div>
      <div className={s.crmEventList} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Historial de actividad">{state.events.length === 0 ? <div className={s.crmActivityEmpty}><CrmIcon name="spark" /><strong>Tu equipo ya está aquí.</strong><p>En unos segundos verás su primera acción, conectada a un cliente.</p></div> : state.events.map(event => {
        const employee = state.team.find(item => item.id === event.employeeId);
        return <article className={s.crmEvent} data-pending={event.status === 'pending'} key={event.id}><EmployeeAvatar id={event.employeeId} name={employee?.name ?? 'Equipo'} size={28} /><div><p><strong>{employee?.name ?? 'Equipo'}</strong> {event.text}</p><div className={s.crmEventMeta}><span>{event.area}</span><span>{event.status === 'pending' ? 'Necesita tu decisión' : event.status === 'approved' ? 'Aprobado' : event.status === 'rejected' ? 'Rechazado' : event.status === 'skipped' ? 'Respetó tu cambio' : 'Registrado'}</span></div>{event.status === 'pending' && <div className={s.crmApprovalButtons}><button type="button" onClick={() => onApproval(event.id, true)}>Aprobar <CrmIcon name="check" /></button><button type="button" onClick={() => onApproval(event.id, false)}>Rechazar</button></div>}<button type="button" className={s.crmEventClient} onClick={() => onContact(event.dealId)}>Ver ficha de {state.deals.find(deal => deal.id === event.dealId)?.company ?? 'cliente'} ↗</button></div></article>;
      })}</div>
      <p className={s.crmActivityFoot}>DEMO EN VIVO · DATOS FICTICIOS</p>
    </div>
  </aside>;
}
