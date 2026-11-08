'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n/types';
import { getMessages } from '@/lib/i18n/messages';

export function SetDocumentLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    const m = getMessages(locale);
    document.title = m.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', m.meta.description);
  }, [locale]);

  return null;
}
