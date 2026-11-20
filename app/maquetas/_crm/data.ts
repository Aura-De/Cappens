import { demoPipeline, modules } from '@/lib/maquetas/product';
import { initialTeam } from './team';
import type { ContactNote, DigitalEmployee, Meeting, Payment, TeamEvent } from './team';

export type ModuleId = (typeof modules)[number]['id'];
export type FieldType = 'texto' | 'numero' | 'fecha' | 'selector';
export type CrmStage = { id: string; name: string };
export type Deal = { id: string; company: string; contact: string; value: number; stageId: string; fields: Record<string, string>; employeeId?: string; proposal?: boolean };
export type CustomField = { id: string; name: string; type: FieldType; options: string[] };
export type Task = { id: string; title: string; company: string; due: string; done: boolean };
export type DemoState = { activeModules: ModuleId[]; stages: CrmStage[]; deals: Deal[]; fields: CustomField[]; tasks: Task[]; team: DigitalEmployee[]; teamPaused: boolean; teamVersion: number; events: TeamEvent[]; notes: ContactNote[]; payments: Payment[]; meetings: Meeting[]; metrics: { completed: number; savedMinutes: number } };

export const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 });
export const moduleGlyphs: Record<ModuleId, string> = {
  contactos: 'contacts', pipeline: 'pipeline', tareas: 'tasks', presupuestos: 'document',
  agenda: 'calendar', soporte: 'support', informes: 'chart', ia: 'spark',
};

export function initialState(): DemoState {
  return {
    activeModules: modules.filter(item => item.core).map(item => item.id),
    team: initialTeam(), teamPaused: false, teamVersion: 0, events: [], notes: [], payments: [], meetings: [], metrics: { completed: 0, savedMinutes: 0 },
    stages: demoPipeline.stages.map((name, index) => ({ id: `stage-${index}`, name })),
    deals: demoPipeline.deals.map(item => ({ id: item.id, company: item.company, contact: item.contact, value: item.value, stageId: `stage-${demoPipeline.stages.indexOf(item.stage)}`, fields: {}, employeeId: item.id === 'd2' ? 'lia' : 'teo' })),
    fields: [],
    tasks: [
      { id: 't1', title: 'Preparar la propuesta', company: 'Clínica Arce', due: 'Hoy', done: false },
      { id: 't2', title: 'Llamar para el seguimiento', company: 'Panadería Lumen', due: 'Hoy', done: false },
      { id: 't3', title: 'Enviar el resumen de la reunión', company: 'Estudio Brisa', due: 'Mañana', done: false },
      { id: 't4', title: 'Confirmar la puesta en marcha', company: 'Academia Delta', due: 'Completada', done: true },
    ],
  };
}

export { newId } from './ids';

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export function fieldLabel(type: FieldType) {
  return { texto: 'Texto', numero: 'Número', fecha: 'Fecha', selector: 'Selector' }[type];
}

export function clamp(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

export function phase(progress: number, start: number, end: number) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}
