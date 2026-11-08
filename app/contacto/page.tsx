'use client';

import Link from 'next/link';
import { ContactSection } from '@/components/contact/ContactSection';
import { LangSwitch } from '@/components/i18n/LangSwitch';
import { LocaleProvider, useLocale } from '@/components/i18n/LocaleProvider';
import { SetDocumentLang } from '@/components/i18n/SetDocumentLang';

function ContactPageContent() {
  const { locale, messages } = useLocale();
  const homeAria = locale === 'en' ? 'Cappens, back to home' : 'Cappens, ir al inicio';

  return (
    <>
      <SetDocumentLang locale={locale} />
      <header className="nav contact-page-nav" id="nav">
        <div className="wrap bar">
          <Link href="/" className="logo-link logo-link--text" aria-label={homeAria}>
            <span className="logo-type">cappens</span>
          </Link>
          <div id="lang-switch-mount" className="lang-switch-slot" />
        </div>
      </header>
      <LangSwitch key={locale} />
      <main className="contact-page-main">
        <ContactSection messages={messages} />
      </main>
    </>
  );
}

export default function ContactoPage() {
  return (
    <LocaleProvider>
      <ContactPageContent />
    </LocaleProvider>
  );
}
