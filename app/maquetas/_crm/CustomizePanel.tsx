'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { modules } from '@/lib/maquetas/product';
import { CrmIcon } from './CrmIcon';
import { fieldLabel } from './data';
import type { CustomField, DemoState, FieldType, ModuleId } from './data';
import s from './crm.module.css';

export type PanelMode = 'customize' | 'deal';
type Props = {
  mode: PanelMode;
  state: DemoState;
  onClose: () => void;
  onToggle: (id: ModuleId) => void;
  onRename: (id: string, name: string) => boolean;
  onStage: (name: string) => boolean;
  onField: (field: Omit<CustomField, 'id'>) => boolean;
  onDeal: (company: string, contact: string, value: number) => void;
};

export function CustomizePanel({ mode, state, onClose, onToggle, onRename, onStage, onField, onDeal }: Props) {
  const close = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldType, setFieldType] = useState<FieldType>('texto');
  useEffect(() => { close.current?.focus(); setError(''); setNotice(''); }, [mode]);

  function addStage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const name = String(new FormData(form).get('stage') ?? '').trim();
    if (!onStage(name)) { setError('Usa un nombre de etapa nuevo, entre 1 y 28 caracteres.'); return; }
    form.reset(); setError(''); setNotice(`Etapa «${name}» añadida.`);
  }
  function addField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('fieldName') ?? '').trim();
    const options = [...new Set(String(data.get('options') ?? '').split(',').map(text => text.trim()).filter(Boolean))];
    if (fieldType === 'selector' && options.length < 2) { setError('Añade al menos dos opciones separadas por comas.'); return; }
    if (!onField({ name, type: fieldType, options })) { setError('Usa un nombre de campo nuevo, entre 1 y 28 caracteres.'); return; }
    form.reset(); setFieldType('texto'); setError(''); setNotice(`Campo «${name}» añadido. Puedes editarlo en Contactos.`);
  }
  function addDeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const company = String(data.get('company') ?? '').trim();
    const person = String(data.get('person') ?? '').trim();
    const value = Number(data.get('value'));
    if (!company || !person || !Number.isFinite(value) || value < 0 || value > 999999999) { setError('Completa empresa, contacto e importe válido.'); return; }
    onDeal(company, person, value);
    form.reset(); setError(''); setNotice('Oportunidad añadida a la primera etapa del pipeline.');
  }

  return <aside className={s.crmCustomPanel} aria-label={mode === 'customize' ? 'Personalizar tu CRM' : 'Nueva oportunidad'}>
    <div className={s.crmPanelHeading}><div><span className={s.crmEyebrow}>TU ESPACIO, TUS REGLAS</span><h3>{mode === 'customize' ? 'A tu medida.' : 'Nueva oportunidad'}</h3></div><button ref={close} type="button" className={s.crmIconButton} onClick={onClose} aria-label="Cerrar panel"><CrmIcon name="close" /></button></div>
    <div className={s.crmPanelScroll}>
      {mode === 'customize' ? <>
        <div className={s.crmPanelSection}><div className={s.crmPanelSectionTitle}><span>01</span><h4>Elige tus módulos</h4></div><p>Empieza con lo justo. Activa más cuando lo necesites.</p>
          <div className={s.crmModuleSettings}>{modules.map(item => <label className={s.crmSwitchRow} key={item.id}><span><strong>{item.name}</strong><small>{item.id === 'contactos' ? 'Base del CRM · siempre activo' : item.desc}</small></span><input type="checkbox" checked={state.activeModules.includes(item.id)} disabled={item.id === 'contactos'} onChange={() => onToggle(item.id)} /><span className={s.crmSwitchTrack} aria-hidden="true"><span /></span></label>)}</div>
        </div>
        <div className={s.crmPanelSection}><div className={s.crmPanelSectionTitle}><span>02</span><h4>Tus etapas de venta</h4></div><p>Cambia un nombre y pulsa Intro o sal del campo para guardarlo.</p><div className={s.crmStageSettings}>{state.stages.map((item, index) => <label className={s.crmStageSetting} key={`${item.id}-${item.name}`}><span>{String(index + 1).padStart(2, '0')}</span><input defaultValue={item.name} maxLength={28} aria-label={`Nombre de la etapa ${index + 1}`} onBlur={event => {
          const next = event.currentTarget.value.trim();
          if (!onRename(item.id, next)) { event.currentTarget.value = item.name; setError('Cada etapa necesita un nombre distinto y no vacío.'); }
          else { setError(''); if (next !== item.name) setNotice(`Etapa renombrada a «${next}».`); }
        }} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } }} /><CrmIcon name="settings" /></label>)}</div><form className={s.crmInlineForm} onSubmit={addStage}><input name="stage" aria-label="Nombre de nueva etapa" placeholder="Nueva etapa…" required maxLength={28} /><button className={s.crmIconButton} type="submit" aria-label="Añadir etapa"><CrmIcon name="plus" /></button></form></div>
        <div className={s.crmPanelSection}><div className={s.crmPanelSectionTitle}><span>03</span><h4>Los campos que necesitas</h4></div><p>Aparecerán en las tarjetas y en la tabla de Contactos.</p>
          {state.fields.length > 0 && <div className={s.crmFieldList}>{state.fields.map(field => <span className={s.crmFieldPill} key={field.id}>{field.name}<small>{fieldLabel(field.type)}</small></span>)}</div>}
          <form onSubmit={addField} className={s.crmPanelForm}><label>Nombre del campo<input name="fieldName" placeholder="Ej. Origen" required maxLength={28} /></label><label>Tipo<select value={fieldType} onChange={event => setFieldType(event.target.value as FieldType)}><option value="texto">Texto</option><option value="numero">Número</option><option value="fecha">Fecha</option><option value="selector">Selector</option></select></label>{fieldType === 'selector' && <label className={s.crmSpanAll}>Opciones, separadas por comas<input name="options" placeholder="Web, Recomendación, Evento" required maxLength={200} /></label>}<button type="submit" className={`${s.crmSecondaryButton} ${s.crmSpanAll}`}><CrmIcon name="plus" /> Añadir campo</button></form>
        </div>
      </> : <div className={s.crmPanelSection}><p>Una nueva conversación. Un nuevo comienzo.</p><form onSubmit={addDeal} className={s.crmPanelForm}><label className={s.crmSpanAll}>Empresa<input name="company" placeholder="Ej. Estudio Olmo" required maxLength={80} /></label><label className={s.crmSpanAll}>Persona de contacto<input name="person" placeholder="Ej. Ana G." required maxLength={70} /></label><label className={s.crmSpanAll}>Importe estimado (€)<input name="value" type="number" min="0" max="999999999" step="0.01" placeholder="2400" required /></label><p className={`${s.crmFormHint} ${s.crmSpanAll}`}>Se añadirá a «{state.stages[0].name}». Los datos solo viven en esta demo.</p><button type="submit" className={`${s.crmPrimaryButton} ${s.crmSpanAll}`}><CrmIcon name="plus" /> Crear oportunidad</button></form></div>}
      <p role="alert" className={s.crmPanelError}>{error}</p><p role="status" className={s.crmPanelNotice}>{notice}</p>
    </div>
    <div className={s.crmPanelFoot}><CrmIcon name="check" /><span>Los cambios se aplican al instante · Demo local</span></div>
  </aside>;
}
