import { activity, employees } from '@/lib/maquetas/product';
import type { Deal, DemoState } from './data';
import { newId } from './ids';

export type DigitalEmployee = { id: string; name: string; role: string; skill: string; active: boolean; completed: number; savedMinutes: number; custom: boolean };
export type TeamEvent = { id: string; employeeId: string; dealId: string; text: string; area: string; status: 'done' | 'pending' | 'approved' | 'rejected' | 'skipped'; kind: 'note' | 'move' | 'meeting' | 'payment' | 'insight' | 'approval'; at: number };
export type ContactNote = { id: string; dealId: string; employeeId: string; text: string };
export type Payment = { id: string; dealId: string; amount: number; paid: boolean };
export type Meeting = { id: string; dealId: string; employeeId: string; title: string };
export type TeamPlan = { employeeId: string; dealId: string; kind: TeamEvent['kind']; text: string; area: string; minutes: number; fromStage: string; toStage?: string };

export function initialTeam() {
  return employees.filter(item => item.id !== 'nuevo').map(item => ({ id: item.id, name: item.name, role: item.role, skill: item.skill, active: true, completed: 0, savedMinutes: 0, custom: false }));
}

export function nextPlan(state: DemoState, step: number): { plan: TeamPlan; next: number } | null {
  const custom = state.team.filter(employee => employee.custom);
  const length = activity.length + custom.length;
  for (let offset = 0; offset < length; offset++) {
    const index = (step + offset) % length;
    const item = index < activity.length ? activity[index] : null;
    const employee = item ? state.team.find(person => person.name === item.who) : custom[index - activity.length];
    if (!employee?.active) continue;
    const kind: TeamPlan['kind'] = !item ? 'note' : 'approval' in item && item.approval ? 'approval' : employee.id === 'teo' ? 'move' : employee.id === 'vera' ? 'meeting' : employee.id === 'max' ? 'payment' : employee.id === 'iris' ? 'insight' : 'note';
    const wanted = kind === 'move' ? state.deals.find(deal => deal.stageId !== 'stage-2' && deal.stageId !== 'stage-3') : kind === 'approval' ? state.deals.find(deal => deal.stageId !== 'stage-3') : undefined;
    const targetId = employee.id === 'lia' ? 'd2' : employee.id === 'vera' ? 'd3' : employee.id === 'max' ? 'd1' : 'd4';
    const deal = wanted ?? state.deals.find(candidate => candidate.id === targetId) ?? state.deals[0];
    if (!deal) return null;
    if (kind === 'approval' && state.events.some(event => event.kind === 'approval' && event.status === 'pending')) continue;
    const toStage = deal.stageId === 'stage-2' ? 'stage-1' : 'stage-2';
    const stageName = state.stages.find(stage => stage.id === toStage)?.name ?? 'Propuesta';
    const text = kind === 'move' ? `movió ${deal.company} a ${stageName} y adjuntó el presupuesto`
      : kind === 'approval' ? `pide aprobación para enviar la propuesta y cerrar ${deal.company}`
      : kind === 'meeting' ? `agendó una reunión con ${deal.company} el jueves a las 10:00`
      : kind === 'payment' ? `registró el cobro de ${deal.company}`
      : kind === 'insight' ? `detectó un seguimiento pendiente en ${deal.company}`
      : employee.custom ? `completó «${employee.skill}» en ${deal.company}`
      : `respondió a ${deal.company} y añadió una nota al historial`;
    return { next: step + offset + 1, plan: { employeeId: employee.id, dealId: deal.id, kind, text, area: item?.where ?? 'Contactos', minutes: kind === 'move' ? 12 : kind === 'meeting' ? 10 : kind === 'payment' ? 8 : 6, fromStage: deal.stageId, toStage: kind === 'move' ? toStage : undefined } };
  }
  return null;
}

function keepEvents(events: TeamEvent[]) {
  return [...events.filter(event => event.status === 'pending'), ...events.filter(event => event.status !== 'pending')].slice(0, 60);
}

function record(state: DemoState, event: TeamEvent, minutes: number): DemoState {
  return { ...state, events: keepEvents([event, ...state.events]), team: state.team.map(employee => employee.id === event.employeeId ? { ...employee, completed: employee.completed + 1, savedMinutes: employee.savedMinutes + minutes } : employee), metrics: { completed: state.metrics.completed + 1, savedMinutes: state.metrics.savedMinutes + minutes } };
}

export function applyPlan(state: DemoState, plan: TeamPlan): DemoState {
  if (state.teamPaused || !state.team.some(employee => employee.id === plan.employeeId && employee.active)) return state;
  const deal = state.deals.find(item => item.id === plan.dealId);
  if (!deal) return state;
  const event: TeamEvent = { id: newId('event'), employeeId: plan.employeeId, dealId: deal.id, text: plan.text, area: plan.area, kind: plan.kind, status: plan.kind === 'approval' ? 'pending' : 'done', at: Date.now() };
  if (plan.kind === 'approval') {
    if (state.events.some(item => item.kind === 'approval' && item.status === 'pending')) return state;
    return { ...state, events: keepEvents([event, ...state.events]) };
  }
  if (plan.kind === 'move' && deal.stageId !== plan.fromStage) return { ...state, events: keepEvents([{ ...event, status: 'skipped', text: `no cambió ${deal.company}: modificaste su etapa durante la acción` }, ...state.events]) };
  let next = state;
  if (plan.kind === 'move') next = { ...next, deals: next.deals.map(item => item.id === deal.id ? { ...item, stageId: plan.toStage ?? item.stageId, proposal: true, employeeId: plan.employeeId } : item) };
  if (plan.kind === 'payment') next = { ...next, payments: [...next.payments, { id: newId('payment'), dealId: deal.id, amount: deal.value, paid: true }].slice(-60) };
  if (plan.kind === 'meeting') {
    const meeting = { id: newId('meeting'), dealId: deal.id, employeeId: plan.employeeId, title: `Reunión con ${deal.company} · jueves 10:00` };
    next = { ...next, meetings: [...next.meetings, meeting].slice(-30), tasks: [...next.tasks, { id: meeting.id, title: 'Preparar reunión del jueves', company: deal.company, due: 'Jueves · 10:00', done: false }].slice(-40) };
  }
  const note = plan.kind === 'note' ? (state.team.find(employee => employee.id === plan.employeeId)?.custom ? plan.text : 'Cambio de cita respondido. Cliente informado; conversación registrada en su ficha.') : plan.kind === 'insight' ? 'Revisar seguimiento comercial: sin próxima acción registrada.' : plan.text;
  next = { ...next, notes: [{ id: event.id, dealId: deal.id, employeeId: plan.employeeId, text: note }, ...next.notes].slice(0, 80) };
  return record(next, event, plan.minutes);
}

export function resolveApproval(state: DemoState, id: string, approved: boolean): DemoState {
  const request = state.events.find(event => event.id === id && event.status === 'pending');
  const deal = request && state.deals.find(item => item.id === request.dealId);
  if (!request || !deal) return state;
  const resolved = { ...state, events: state.events.map(event => event.id === id ? { ...event, status: approved ? 'approved' as const : 'rejected' as const } : event), deals: approved ? state.deals.map(item => item.id === deal.id ? { ...item, stageId: 'stage-3', proposal: true } : item) : state.deals };
  const event: TeamEvent = { ...request, id: newId('event'), kind: 'note', status: 'done', at: Date.now(), text: approved ? `ejecutó tu aprobación: ${deal.company} pasa a ${state.stages.find(stage => stage.id === 'stage-3')?.name ?? 'Ganado'}` : `registró tu rechazo: ${deal.company} conserva su etapa`, area: 'Aprobaciones' };
  const next = { ...resolved, notes: [{ id: event.id, employeeId: event.employeeId, dealId: deal.id, text: event.text }, ...state.notes].slice(0, 80) };
  return record(next, event, approved ? 12 : 2);
}

export function employeeForDeal(state: DemoState, deal: Deal) {
  return state.team.find(employee => employee.id === deal.employeeId) ?? state.team[0];
}
