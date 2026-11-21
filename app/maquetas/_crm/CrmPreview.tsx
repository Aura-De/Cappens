'use client';

import { memo } from 'react';
import type { CSSProperties } from 'react';
import { brand } from '@/lib/maquetas/content';
import { activity, demoPipeline, employees, modules } from '@/lib/maquetas/product';
import { EmployeeAvatar } from './EmployeeAvatar';
import { CrmIcon } from './CrmIcon';
import { clamp, currency, initials, moduleGlyphs, phase } from './data';
import { useReducedMotion } from './hooks';
import s from './crm.module.css';

const previewStages = demoPipeline.stages.map((name, index) => ({
  name, index,
  deals: demoPipeline.deals.filter(deal => deal.stage === name),
  total: demoPipeline.deals.filter(deal => deal.stage === name).reduce((sum, deal) => sum + deal.value, 0),
}));
const previewModules = modules.filter(item => item.core || item.id === 'informes');
const papers = [
  { title: 'Clientes_final_v3.xlsx', detail: 'EMPRESA / CONTACTO / ¿ESTADO?', mark: '▦', x: 5, y: 16, rotate: -12 },
  { title: 'Llamar a Marta', detail: 'LUNES · NO OLVIDAR', mark: '↗', x: 43, y: 10, rotate: 9 },
  { title: 'Propuesta pendiente', detail: '¿SE LA ENVIAMOS YA?', mark: '☰', x: 22, y: 57, rotate: -5 },
  { title: 'Notas de la reunión', detail: 'PRÓXIMOS PASOS…', mark: '✎', x: 62, y: 49, rotate: 14 },
];

function Preview({ progress }: { progress: number }) {
  const reduced = useReducedMotion();
  const travel = reduced ? 0.15 : 1;
  const p = clamp(progress);
  const organize = phase(p, 0.2, 0.45);
  const expand = phase(p, 0.75, 1);
  const teamProgress = phase(p, 0.85, 1);
  const won = demoPipeline.deals.filter(deal => deal.stage === 'Ganado').reduce((sum, deal) => sum + deal.value, 0);
  const sidebarStyle: CSSProperties = { opacity: organize, transform: `translateX(${(1 - organize) * -105 * travel}%)`, filter: `blur(${(1 - organize) * 5 * travel}px)` };
  const headerStyle: CSSProperties = { opacity: organize, transform: `translateY(${(1 - organize) * -20 * travel}px)` };

  return <div className={s.crmPreview} role="img" aria-label={`Vista ilustrativa del CRM Cappens. ${p < 0.2 ? 'Archivos y notas dispersos.' : p < 0.45 ? 'Los datos se ordenan y aparece el espacio de trabajo.' : p < 0.75 ? 'Se construye el pipeline de ventas.' : p < 0.85 ? 'CRM personalizado con el campo Origen, informes y ventas del mes.' : 'Tu equipo digital trabaja dentro del CRM; cada acción se registra en su cliente.'}`}>
    <div className={s.crmPreviewWindow} aria-hidden="true">
      <div className={s.crmPreviewBar}><span className={s.crmWindowDots}><i /><i /><i /></span><span>◇ &nbsp; app.cappens.io</span><span className={s.crmPreviewBadge}>TU CRM, A TU MEDIDA</span></div>
      <div className={s.crmPreviewBody}>
        <div className={s.crmPreviewPapers}>{papers.map((paper, index) => {
          const settle = phase(p, 0.2 + index * 0.025, 0.39 + index * 0.015);
          const float = phase(p, 0, 0.2);
          return <div key={paper.title} className={s.crmPreviewPaper} style={{ left: `${paper.x}%`, top: `${paper.y}%`, opacity: 1 - settle, transform: `translate(${settle * (index % 2 ? -75 : 65) * travel}%, ${(float * -9 + settle * 50) * travel}%) rotate(${paper.rotate * (1 - settle) * travel}deg) scale(${1 - settle * 0.5 * travel})`, filter: `blur(${settle * 6 * travel}px)` }}><span className={s.crmPaperMark}>{paper.mark}</span><strong>{paper.title}</strong><small>{paper.detail}</small><i /><i /><i /></div>;
        })}</div>
        <div className={s.crmPreviewApp}>
          <div className={s.crmPreviewSidebar} style={sidebarStyle}><div className={s.crmPreviewBrand}><img src={brand.logo.mark} alt="" /><strong>{brand.name}</strong></div><span className={s.crmPreviewNavLabel}>TU NEGOCIO</span>{previewModules.map(item => <div key={item.id} className={s.crmPreviewNavItem} data-selected={item.id === 'pipeline'} style={item.id === 'informes' ? { opacity: expand, transform: `translateX(${(1 - expand) * -20 * travel}px)` } : undefined}><CrmIcon name={moduleGlyphs[item.id]} /><span>{item.id === 'pipeline' ? 'Pipeline de ventas' : item.id === 'tareas' ? 'Tareas' : item.name}</span>{item.id === 'informes' && <small>Nuevo</small>}</div>)}<div className={s.crmPreviewTeam} style={{ opacity: teamProgress, transform: `perspective(500px) rotateY(${(1 - teamProgress) * -65 * travel}deg)` }}><span>EQUIPO DIGITAL</span><div>{employees.filter(employee => employee.id !== 'nuevo').map((employee, index) => { const enter = phase(p, 0.85 + index * .012, 0.94 + index * .012); return <span key={employee.id} style={{ opacity: enter, transform: `translateY(${(1 - enter) * 12 * travel}px) rotate(${(1 - enter) * -25 * travel}deg)` }}><EmployeeAvatar id={employee.id} name={employee.name} size={24} /></span>; })}</div><small>5 compañeros. Un mismo espacio.</small></div><div className={s.crmPreviewSidebarFoot}><span className={s.crmOwnerAvatar}>CP</span><span>Equipo Cappens</span></div></div>
          <div className={s.crmPreviewMain}>
            <div className={s.crmPreviewTop} style={headerStyle}><span>Mi espacio &nbsp;/&nbsp; <strong>Pipeline de ventas</strong></span><span><CrmIcon name="settings" /> Personalizar</span></div>
            <div className={s.crmPreviewHeading} style={headerStyle}><div><span>CAPPENS / MINI CRM</span><h3>Cada oportunidad cuenta.</h3><p>De la primera conversación a un nuevo sí.</p></div><span className={s.crmPreviewNew}>+ Nueva oportunidad</span></div>
            <div className={s.crmPreviewToolbar} style={{ opacity: phase(p, 0.38, 0.52) }}><span><CrmIcon name="pipeline" /> Vista tablero</span><span>5 oportunidades</span></div>
            <div className={s.crmPreviewBoard}>{previewStages.map(stage => {
              const colProgress = phase(p, 0.43 + stage.index * 0.035, 0.59 + stage.index * 0.035);
              return <div key={stage.name} className={s.crmPreviewColumn} style={{ opacity: colProgress, transform: `translateY(${(1 - colProgress) * 35 * travel}px)`, filter: `blur(${(1 - colProgress) * 3 * travel}px)` }}><div className={s.crmPreviewColumnHead}><span className={s.crmStageDot} data-won={stage.name === 'Ganado'} /><strong>{stage.name}</strong><small>{stage.deals.length}</small><span>{currency.format(stage.total)}</span></div>{stage.deals.map(deal => {
                const dealIndex = demoPipeline.deals.findIndex(item => item.id === deal.id);
                const arrive = phase(p, 0.47 + dealIndex * 0.03, 0.62 + dealIndex * 0.03);
                return <div key={deal.id} className={s.crmPreviewCard} style={{ opacity: arrive, transform: `translate(${(1 - arrive) * (dealIndex % 2 ? 35 : -35) * travel}px, ${(1 - arrive) * 65 * travel}px) rotate(${(1 - arrive) * (dealIndex % 2 ? 9 : -9) * travel}deg) scale(${1 - (1 - arrive) * 0.14 * travel})`, filter: `blur(${(1 - arrive) * 3 * travel}px)` }}><div><span className={s.crmPreviewAvatar}>{initials(deal.company)}</span><strong>{deal.company}</strong></div><span className={s.crmPreviewContact}>{deal.contact}</span><span className={s.crmPreviewValue}>{currency.format(deal.value)}<span>CP</span></span><span className={s.crmPreviewField} style={{ opacity: expand, transform: `translateY(${(1 - expand) * 8 * travel}px) scale(${1 - (1 - expand) * 0.1 * travel})` }}>Origen: Web</span></div>;
              })}</div>;
            })}</div>
            <div className={s.crmPreviewActivity}>{activity.slice(0, 3).map((item, index) => { const show = phase(p, .87 + index * .02, .95 + index * .025); const employee = employees.find(person => person.name === item.who); return <div key={item.who} className={s.crmPreviewBubble} style={{ opacity: show, transform: `translate(${(1 - show) * 25 * travel}px, ${(1 - show) * 10 * travel}px) scale(${1 - (1 - show) * .15 * travel})`, top: `${index * 6.5}cqw`, right: `${index % 2 ? 10 : 0}cqw` }}><EmployeeAvatar id={employee?.id ?? 'teo'} name={item.who} size={20} /><span><strong>{item.who}</strong>{index === 0 ? 'Respuesta registrada en Clínica Arce' : index === 1 ? 'Estudio Brisa → Propuesta' : 'Reunión guardada en Taller Norte'}</span><CrmIcon name="check" /></div>; })}</div>
            <div className={s.crmPreviewSales} style={{ opacity: expand, transform: `translateY(${(1 - expand) * 15 * travel}px)` }}><span><CrmIcon name="chart" /> Ventas del mes</span><strong>{currency.format(Math.round(won * expand))}</strong><span className={s.crmPreviewSalesBars}>{[0.2, 0.5, 0.35, 0.7, 0.55, 0.85, 1].map((height, index) => <i key={index} style={{ transform: `scaleY(${height * expand})` }} />)}</span></div>
          </div>
        </div>
        <span className={s.crmPreviewChaosCaption} style={{ opacity: 1 - organize, transform: `translateY(${organize * 10 * travel}px)` }}>Muchos sitios. Un mismo negocio.</span>
      </div>
      <div className={s.crmPreviewFoot}><span>DATOS DE EJEMPLO</span><span style={{ opacity: organize }}><span className={s.crmLiveDot} /> Un espacio que crece contigo.</span><span>CAPPENS</span></div>
    </div>
  </div>;
}

const MemoPreview = memo(Preview);

export function CrmPreview({ progress }: { progress: number }) {
  return <MemoPreview progress={progress} />;
}
