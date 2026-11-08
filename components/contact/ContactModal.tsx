'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Messages } from '@/lib/i18n/messages';
import { ContactForm } from './ContactForm';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
  messages: Messages;
};

export function ContactModal({ open, onClose, messages }: ContactModalProps) {
  const t = messages.contact;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="contact-modal-root" role="presentation">
      <button type="button" className="contact-modal-overlay" aria-label={t.close} onClick={onClose} />
      <div
        ref={panelRef}
        className="contact-modal glass-panel glass-crystal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="contact-modal-head">
          <h2 id="contact-modal-title" className="contact-modal-title">
            {t.modalTitle}
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="contact-modal-close"
            aria-label={t.closeDialog}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="contact-modal-lead">{t.modalLead}</p>
        <ContactForm formId="contact-modal-form" variant="modal" messages={messages} />
      </div>
    </div>,
    document.body
  );
}
