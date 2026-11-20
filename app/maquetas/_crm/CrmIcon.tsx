import type { CSSProperties } from 'react';
import s from './crm.module.css';

const paths: Record<string, string> = {
  contacts: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  pipeline: 'M3 4h5v16H3zM10 4h5v10h-5zM17 4h4v13h-4z',
  tasks: 'm3 6 2 2 4-4M12 6h9M3 14l2 2 4-4M12 14h9M12 21h9',
  document: 'M14 2H5v20h14V7zM14 2v6h5M8 12h8M8 16h8',
  calendar: 'M3 5h18v16H3zM7 2v6M17 2v6M3 10h18M7 14h3M14 14h3M7 18h3',
  support: 'M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7zM20 12h2v7h-4v-7zM18 19v3h-6',
  chart: 'M3 3v18h18M7 16v-4M12 16V8M17 16V5',
  spark: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',
  settings: 'M4 7h16M4 17h16M8 4v6M16 14v6',
  plus: 'M12 5v14M5 12h14',
  close: 'm6 6 12 12M6 18 18 6',
  search: 'm16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12 4 4L19 6',
  grip: 'M8 5h1M15 5h1M8 12h1M15 12h1M8 19h1M15 19h1',
  reset: 'M3 10a9 9 0 1 1 1 8M3 3v7h7',
  cursor: 'M4 2v18l5-5 4 7 4-2-4-7 7-1Z',
};

export function CrmIcon({ name, className = '', style }: { name: string; className?: string; style?: CSSProperties }) {
  return <svg className={`${s.crmIcon} ${className}`} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.document} /></svg>;
}
