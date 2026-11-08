'use client';

import type { Messages } from '@/lib/i18n/messages';
import { ContactForm } from './ContactForm';

type ContactSectionProps = {
  messages: Messages;
};

export function ContactSection({ messages }: ContactSectionProps) {
  const t = messages.contact;
  return (
    <section id="contacto" className="contact-section" aria-label={t.label}>
      <div className="wrap">
        <p className="label reveal" id="contacto-label">
          {t.label}
        </p>
        <div className="contact-section-panel glass-panel glass-crystal reveal" style={{ ['--r' as string]: 1 }}>
          <ContactForm formId="contact-page-form" messages={messages} />
        </div>
      </div>
    </section>
  );
}
