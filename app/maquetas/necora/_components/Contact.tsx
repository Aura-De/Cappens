'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Reveal, Words } from '@/app/maquetas/_motion/motion';
import { productCta } from '@/lib/maquetas/product';
import styles from '../necora.module.css';

type Status = 'idle' | 'submitting' | 'ok' | 'error' | 'invalid';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (request.current) return;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!name.trim() || !emailOk || !message.trim()) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    const controller = new AbortController();
    request.current = controller;
    try {
      const res = await fetch(productCta.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error('fail');
      const data: unknown = await res.json();
      if (controller.signal.aborted) return;
      if (typeof data !== 'object' || data === null || !('ok' in data) || data.ok !== true) throw new Error('fail');
      setStatus('ok');
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch {
      if (!controller.signal.aborted) setStatus('error');
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return (
    <section id="contacto" className={styles.ncContact} aria-label="Pedir demo">
      <Reveal from="scale" once className={styles.ncContactPanel}>
        <Words text={productCta.title} as="h2" className={styles.ncContactTitle} effect="blur" once />
        <p className={styles.ncContactLead}>{productCta.lead}</p>
        <form className={styles.ncForm} onSubmit={onSubmit} noValidate>
          <label>
            <span className={styles.ncSrOnly}>Nombre</span>
            <input
              name="name"
              autoComplete="name"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label>
            <span className={styles.ncSrOnly}>Correo</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting'}
              required
            />
          </label>
          <label className={styles.ncFormFull}>
            <span className={styles.ncSrOnly}>Empresa</span>
            <input
              name="company"
              autoComplete="organization"
              placeholder="Empresa (opcional)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={status === 'submitting'}
            />
          </label>
          <label className={styles.ncFormFull}>
            <span className={styles.ncSrOnly}>Mensaje</span>
            <textarea
              name="message"
              rows={4}
              placeholder="Cuéntanos cómo trabajáis"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === 'submitting'}
              required
            />
          </label>
          <button className={styles.ncBtnPrimary} type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Enviando…' : 'Pide tu demo'}
          </button>
        </form>
        {status === 'ok' ? (
          <p className={styles.ncFormOk} role="status">
            Solicitud validada en la demo. El envío de correo todavía no está conectado.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className={styles.ncFormErr} role="alert">
            No hemos podido enviar ahora. Inténtalo de nuevo.
          </p>
        ) : null}
        {status === 'invalid' ? (
          <p className={styles.ncFormErr} role="alert">
            Completa nombre, correo válido y mensaje.
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
