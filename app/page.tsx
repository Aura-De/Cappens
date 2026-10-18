'use client';

import { useCallback, useState } from 'react';
import { cappensMarkup } from '@/lib/cappens-markup';
import { ContactModal } from '@/components/contact/ContactModal';
import { ContactSection } from '@/components/contact/ContactSection';
import { useCappensPageEffects } from '@/components/useCappensPageEffects';

export default function Home() {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const openContactModal = useCallback(() => setContactModalOpen(true), []);
  const closeContactModal = useCallback(() => setContactModalOpen(false), []);

  useCappensPageEffects({ onContactNavClick: openContactModal });

  return (
    <>
      <div
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{ __html: cappensMarkup }}
      />
      <ContactSection />
      <ContactModal open={contactModalOpen} onClose={closeContactModal} />
    </>
  );
}
