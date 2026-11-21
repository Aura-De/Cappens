'use client';

import { useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { DemoState } from './data';
import { newId } from './ids';
import { EmployeeAvatar } from './EmployeeAvatar';
import { CrmIcon } from './CrmIcon';
import s from './crm.module.css';

export function TeamPanel({ state, setState, workingId }: { state: DemoState; setState: Dispatch<SetStateAction<DemoState>>; workingId: string | null }) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('employeeName') ?? '').trim();
    const task = String(data.get('employeeTask') ?? '').trim();
    if (!name || !task) { setError('Indica un nombre y la tarea que hará.'); return; }
    const employee = { id: newId('employee'), name, role: 'A tu medida', skill: task, active: true, completed: 0, savedMinutes: 0, custom: true };
    setState(previous => ({ ...previous, team: [...previous.team, employee] }));
    setAdding(false); setError('');
  }
  return <div className={s.crmTeamView}>
    <div className={s.crmTeamIntro}><div><span className={s.crmLiveDot} /><span>{state.team.filter(employee => employee.active).length} empleados listos · {state.teamPaused ? 'Equipo pausado' : 'Trabajando dentro de tu CRM'}</span></div><button type="button" className={s.crmSecondaryButton} onClick={() => setAdding(!adding)} aria-expanded={adding}><CrmIcon name="plus" /> Nuevo empleado</button></div>
    {adding && <form className={s.crmEmployeeForm} onSubmit={create}><label>Nombre<input name="employeeName" placeholder="Ej. Nico" required maxLength={35} autoFocus /></label><label>Tarea que hará<input name="employeeTask" placeholder="Ej. Preparar los pedidos recurrentes" required maxLength={160} /></label><button type="submit" className={s.crmPrimaryButton}>Crear empleado <CrmIcon name="plus" /></button><button type="button" className={s.crmSecondaryButton} onClick={() => setAdding(false)}>Cancelar</button><p role="alert">{error}</p></form>}
    <div className={s.crmTeamGrid}>{state.team.map(employee => <article className={s.crmEmployeeCard} key={employee.id} data-active={employee.active}>
      <div className={s.crmEmployeeCardTop}><EmployeeAvatar id={employee.id} name={employee.name} size={48} working={!state.teamPaused && workingId === employee.id} /><label className={s.crmEmployeeSwitch}><input type="checkbox" role="switch" checked={employee.active} aria-label={`${employee.active ? 'Pausar' : 'Activar'} a ${employee.name}`} onChange={() => setState(previous => ({ ...previous, team: previous.team.map(item => item.id === employee.id ? { ...item, active: !item.active } : item) }))} /><span aria-hidden="true"><i /></span></label></div>
      <h3>{employee.name}</h3><span className={s.crmEmployeeRole}>{employee.role}</span><p>{employee.skill}</p><span className={s.crmEmployeeStatus} data-working={workingId === employee.id && !state.teamPaused}><span />{!employee.active || state.teamPaused ? 'En pausa' : workingId === employee.id ? 'Trabajando ahora' : 'Listo para trabajar'}</span><div className={s.crmEmployeeStats}><span><strong>{employee.completed}</strong> tareas hoy</span><span><strong>{employee.savedMinutes} min</strong> ahorrados</span></div>
    </article>)}<button className={s.crmNewEmployeeCard} type="button" onClick={() => setAdding(true)}><span><CrmIcon name="plus" /></span><strong>El siguiente lo eliges tú.</strong><small>Un nombre. Una tarea. Un nuevo compañero.</small></button></div>
    <p className={s.crmTeamDisclaimer}>Equipo y acciones simuladas. Ningún correo, pago ni cita sale de esta demo.</p>
  </div>;
}
