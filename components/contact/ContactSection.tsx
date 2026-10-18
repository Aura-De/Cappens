'use client';

import { ContactForm } from './ContactForm';

export function ContactSection() {
  return (
    <section id="contacto" className="contact-section" aria-labelledby="contacto-title">
      <div className="wrap">
        <p className="label reveal">Contacto</p>
        <h2 id="contacto-title" className="contact-section-title reveal" style={{ ['--r' as string]: 1 }}>
          Hablemos de tu proyecto.
        </h2>
        <div className="contact-section-panel glass-panel reveal" style={{ ['--r' as string]: 2 }}>
          <ContactForm formId="contact-page-form" />
        </div>
      </div>
    </section>
  );
}
