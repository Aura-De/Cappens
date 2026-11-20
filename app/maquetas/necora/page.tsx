'use client';

import { useState } from 'react';
import { OrigamiPreloader } from '@/app/maquetas/_motion/OrigamiLogo';
import { Beyond } from './_components/Beyond';
import { Cases } from './_components/Cases';
import { Contact } from './_components/Contact';
import { Demo } from './_components/Demo';
import { Features } from './_components/Features';
import { Footer } from './_components/Footer';
import { Header } from './_components/Header';
import { Hero } from './_components/Hero';
import { Includes } from './_components/Includes';
import { Modules } from './_components/Modules';
import { Story } from './_components/Story';
import { Team } from './_components/Team';
import styles from './necora.module.css';

export default function NecoraProductPage() {
  const [ready, setReady] = useState(false);

  return (
    <div className={styles.ncRoot}>
      <OrigamiPreloader
        onReveal={() => setReady(true)}
        onDone={() => setReady(true)}
        caption="Empleados digitales · CRM a medida"
      />
      {ready ? (
        <>
          <Header ready />
          <main className={styles.ncMainIn}>
            <Hero ready />
            <Story />
            <Team />
            <Beyond />
            <Features />
            <Demo />
            <Modules />
            <Includes />
            <Cases />
            <Contact />
          </main>
          <Footer />
        </>
      ) : null}
    </div>
  );
}
