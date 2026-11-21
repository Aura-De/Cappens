'use client';

import { OrigamiLogo } from '@/app/maquetas/_motion/OrigamiLogo';
import { brand } from '@/lib/maquetas/content';
import styles from '../necora.module.css';

const links = [
  { href: '#top', label: 'Inicio' },
  { href: '#story', label: 'Cómo funciona' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#demo', label: 'Demo' },
  { href: '#mas-alla', label: 'Más allá' },
  { href: '#casos', label: 'Casos' },
  { href: '#contacto', label: 'Contacto' },
] as const;

export function Footer() {
  return (
    <footer className={styles.ncFooter} aria-label="Pie">
      <div className={styles.ncFooterInner}>
        <OrigamiLogo variant="full" play="inView" className={styles.ncFooterLogo} />
        <nav className={styles.ncFooterLinks} aria-label="Secciones">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className={styles.ncFooterMeta}>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <span>{brand.fullName} · Empleados digitales y CRM a medida</span>
        </div>
      </div>
    </footer>
  );
}
