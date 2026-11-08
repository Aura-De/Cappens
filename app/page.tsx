'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { getCappensMarkup } from '@/lib/get-cappens-markup';
import { useCappensPageEffects } from '@/components/useCappensPageEffects';
import { StackTools } from '@/components/StackTools';
import { LangSwitch } from '@/components/i18n/LangSwitch';
import { LocaleProvider, useLocale } from '@/components/i18n/LocaleProvider';
import { SetDocumentLang } from '@/components/i18n/SetDocumentLang';

function HomeContent() {
  const { locale } = useLocale();
  const markupHostRef = useRef<HTMLDivElement>(null);

  const markup = useMemo(() => getCappensMarkup(locale), [locale]);

  useLayoutEffect(() => {
    if (markupHostRef.current) {
      markupHostRef.current.innerHTML = markup;
    }
  }, [markup]);

  useCappensPageEffects({
    locale,
    menuLabels: {
      open: locale === 'en' ? 'Open menu' : 'Abrir menú',
      close: locale === 'en' ? 'Close menu' : 'Cerrar menú',
    },
  });

  return (
    <>
      <SetDocumentLang locale={locale} />
      <div ref={markupHostRef} className="cappens-markup-host" />
      <LangSwitch key={locale} />
      <StackTools locale={locale} />
    </>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <HomeContent />
    </LocaleProvider>
  );
}
