'use client';

import { useId, useState } from 'react';
import type { Messages } from '@/lib/i18n/messages';

export type ContactFormPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type ContactFormProps = {
  formId?: string;
  variant?: 'default' | 'modal';
  messages: Messages;
  onSuccess?: () => void;
};

export function ContactForm({ formId, variant = 'default', messages, onSuccess }: ContactFormProps) {
  const t = messages.contact;
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
      if (!res.ok) throw new Error(t.errorNetwork);
      setStatus('success');
      e.currentTarget.reset();
      onSuccess?.();
    } catch {
      setStatus('error');
      setErrorMsg(t.errorSend);
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-success glass-panel" role="status">
        <p className="contact-success-title">{t.thanksTitle}</p>
        <p className="contact-success-text">{t.thanksText}</p>
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
          <label htmlFor={`${id}-name`}>{t.name}</label>
          <input id={`${id}-name`} name="name" type="text" required autoComplete="name" />
        </div>
        <div className="contact-field">
          <label htmlFor={`${id}-email`}>{t.email}</label>
          <input id={`${id}-email`} name="email" type="email" required autoComplete="email" />
        </div>
        <div className="contact-field contact-field--full">
          <label htmlFor={`${id}-company`}>
            {t.company} <span className="contact-optional">{t.companyOptional}</span>
          </label>
          <input id={`${id}-company`} name="company" type="text" autoComplete="organization" />
        </div>
        <div className="contact-field contact-field--full">
          <label htmlFor={`${id}-message`}>{t.message}</label>
          <textarea id={`${id}-message`} name="message" rows={5} required />
        </div>
      </div>
      {status === 'error' && (
        <p className="contact-error" role="alert">
          {errorMsg}
        </p>
      )}
      <button type="submit" className="btn solid contact-submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? t.submitting : t.submit}
      </button>
    </form>
  );
}
