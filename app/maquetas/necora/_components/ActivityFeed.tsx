'use client';

import { useEffect, useState } from 'react';
import { EmployeeAvatar } from '@/app/maquetas/_crm/EmployeeAvatar';
import { usePrefersReducedMotion } from '@/app/maquetas/_motion/motion';
import { activity, employees } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

function employeeIdByName(name: string): string {
  const found = employees.find((e) => e.name === name);
  return found?.id ?? 'nuevo';
}

/** Burbujas de actividad encima del CRM (hero / story). */
export function ActivityFeed({ dense = false }: { dense?: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % activity.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  const visible = reduced
    ? activity.slice(0, dense ? 3 : 4)
    : [activity[index], activity[(index + 1) % activity.length], activity[(index + 2) % activity.length]];

  return (
    <div className={`${styles.ncActivity} ${dense ? styles.ncActivityDense : ''}`} aria-hidden="true">
      {visible.map((item, i) => (
        <div
          key={`${item.who}-${item.t}-${i}`}
          className={`${styles.ncActivityBubble} ${'approval' in item && item.approval ? styles.ncActivityApproval : ''}`}
          style={{ ['--b' as string]: String(i) }}
        >
          <EmployeeAvatar id={employeeIdByName(item.who)} name={item.who} size={dense ? 28 : 34} working />
          <div>
            <strong>{item.who}</strong>
            <p>{item.what}</p>
            <span>
              {item.where} · {item.t}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
