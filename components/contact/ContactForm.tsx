'use client';

import { useId, useState } from 'react';

export type ContactFormPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type ContactFormProps = {
  formId?: string;
  /** Compact layout for modal */
  variant?: 'default' | 'modal';
  onSuccess?: () => void;
};

export function ContactForm({ formId, variant = 'default', onSuccess }: ContactFormProps) {
  const uid = useId();
  const id = formId ?? `contact-${uid}`;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const payload: ContactFormPayload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      company: String(fd.get('company') ?? '').trim(),
      message: String(fd.get('message') ?? '').trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('No se pudo enviar');
      setStatus('success');
      e.currentTarget.reset();
      onSuccess?.();
    } catch {
      setStatus('error');
      setErrorMsg('Algo falló al enviar. Inténtalo de nuevo en un momento.');
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success glass-panel" role="status">
        <p className="contact-success-title">Gracias</p>
        <p className="contact-success-text">Te contactaremos pronto.</p>
      </div>
    );
  }

  return (
    <form
      id={id}
      className={`contact-form${variant === 'modal' ? ' contact-form--modal' : ''}`}
      onSubmit={handleSubmit}
      noValidate={false}
    >
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor={`${id}-name`}>Nombre</label>
          <input id={`${id}-name`} name="name" type="text" required autoComplete="name" />
        </div>
        <div className="contact-field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" />
        </div>
        <div className="contact-field contact-field--full">
          <label htmlFor={`${id}-company`}>
            Empresa <span className="contact-optional">(opcional)</span>
          </label>
          <input id={`${id}-company`} name="company" type="text" autoComplete="organization" />
        </div>
        <div className="contact-field contact-field--full">
          <label htmlFor={`${id}-message`}>Mensaje</label>
          <textarea id={`${id}-message`} name="message" rows={5} required />
        </div>
      </div>
      {status === 'error' && (
        <p className="contact-error" role="alert">
          {errorMsg}
        </p>
      )}
      <button type="submit" className="btn solid contact-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
