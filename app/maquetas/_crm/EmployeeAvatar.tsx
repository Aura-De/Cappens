'use client';

import { useId } from 'react';
import type { CSSProperties } from 'react';
import { employees } from '@/lib/maquetas/product';
import s from './crm.module.css';

export function EmployeeAvatar({ id, name, size = 40, working = false }: { id: string; name: string; size?: number; working?: boolean }) {
  const clip = `crm-avatar-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const tone = employees.find(employee => employee.id === id)?.color ?? 'ink';
  const diameter = Number.isFinite(size) ? Math.max(12, Math.min(160, size)) : 40;
  return <span className={s.crmEmployeeAvatar} data-tone={tone} data-working={working} style={{ '--crm-avatar-size': `${diameter}px` } as CSSProperties} role="img" aria-label={`${name}${working ? ', trabajando' : ''}`}>
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs><clipPath id={clip}><path d="M18 2h28l16 16v28L46 62H18L2 46V18Z" /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <path className={s.crmAvatarBase} d="M0 0h64v64H0z" />
        <path className={s.crmAvatarLight} d="M0 0h35L18 25Z" />
        <path className={s.crmAvatarFacet} d="m35 0 29 18-28 9-18-2Z" />
        <path className={s.crmAvatarShade} d="m64 18-5 46-23-37Z" />
        <path className={s.crmAvatarLight} d="M0 0 18 25 0 49Z" />
        <path className={s.crmAvatarFacet} d="m0 49 18-24 18 2-7 37Z" />
        <path className={s.crmAvatarShade} d="m0 49 29 15H0Z" />
        <path className={s.crmAvatarLight} d="m36 27 23 37H29Z" />
        <path className={s.crmAvatarSeam} d="m0 0 18 25 18 2L64 18M0 49l18-24M36 27l-7 37" />
      </g>
      <text x="32" y="34" dominantBaseline="middle" textAnchor="middle" className={s.crmAvatarInitial}>{Array.from(name.trim())[0]?.toLocaleUpperCase('es') ?? 'C'}</text>
    </svg>
    <span className={s.crmAvatarRing} aria-hidden="true" />
  </span>;
}
