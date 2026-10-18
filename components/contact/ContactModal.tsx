'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ContactForm } from './ContactForm';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactModal({ open, onClose }: ContactModalProps) {
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
      <button type="button" className="contact-modal-overlay" aria-label="Cerrar" onClick={onClose} />
      <div
        ref={panelRef}
        className="contact-modal glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <div className="contact-modal-head">
          <h2 id="contact-modal-title" className="contact-modal-title">
            Contacto
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            className="contact-modal-close"
            aria-label="Cerrar ventana de contacto"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p className="contact-modal-lead">Cuéntanos tu proyecto y te respondemos lo antes posible.</p>
        <ContactForm formId="contact-modal-form" variant="modal" />
      </div>
    </div>,
    document.body
  );
}
