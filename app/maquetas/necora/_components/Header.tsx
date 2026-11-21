'use client';

import { useEffect, useState } from 'react';
import { OrigamiLogo } from '@/app/maquetas/_motion/OrigamiLogo';
import { product } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

const links = [
  { href: '#story', label: 'Cómo funciona' },
  { href: '#equipo', label: 'Equipo' },
  { href: '#demo', label: 'Demo' },
  { href: '#mas-alla', label: 'Más allá' },
  { href: '#casos', label: 'Casos' },
] as const;

export function Header({ ready }: { ready: boolean }) {
  const [compact, setCompact] = useState(false);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 48);
      const story = document.getElementById('story');
      if (!story) {
        setOverDark(false);
        return;
      }
      const r = story.getBoundingClientRect();
      const wash = story.querySelector('[class*="ncStoryWash"]');
      const washOp = wash ? Number.parseFloat(getComputedStyle(wash).opacity || '0') : 0;
      // solo el tramo oscuro del story (antes del wash/finale claro)
      setOverDark(r.top < 80 && r.bottom > 120 && washOp < 0.28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`${styles.ncHeader} ${compact ? styles.ncHeaderCompact : ''} ${ready ? styles.ncHeaderIn : ''} ${overDark ? styles.ncHeaderOnDark : ''}`}
      aria-label="Cabecera"
    >
      <a className={styles.ncBrand} href="#top" aria-label="Cappens">
        {ready ? (
          <OrigamiLogo variant="full" play="mount" interactive className={styles.ncBrandLogo} />
        ) : null}
      </a>
      <nav className={styles.ncMenu} aria-label="Principal">
        {links.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className={styles.ncBtnPrimary} href="#contacto">
        {product.heroCta.primary}
      </a>
    </header>
  );
}
