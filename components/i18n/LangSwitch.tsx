'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from './LocaleProvider';

function FlagEs() {
  return (
    <svg className="lang-flag" viewBox="0 0 3 2" aria-hidden="true" focusable="false">
      <rect width="3" height="2" fill="#c60b1e" />
      <rect width="3" height=".66" y=".66" fill="#ffc400" />
    </svg>
  );
}

function FlagUs() {
  return (
    <svg className="lang-flag" viewBox="0 0 19 10" aria-hidden="true" focusable="false">
      <rect width="19" height="10" fill="#b22234" />
      {[0, 2, 4, 6, 8].map((y) => (
        <rect key={y} width="19" height="1" y={y + 1} fill="#fff" />
      ))}
      <rect width="7.6" height="5.4" fill="#3c3b6e" />
    </svg>
  );
}

export function LangSwitch() {
  const { locale, setLocale, messages } = useLocale();
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMount(document.getElementById('lang-switch-mount'));
  }, [locale]);

  if (!mount) return null;

  return createPortal(
    <div className="lang-switch" role="group" aria-label={messages.lang.switch}>
      <button
        type="button"
        className={`lang-switch__btn${locale === 'es' ? ' is-active' : ''}`}
        aria-pressed={locale === 'es'}
        aria-label={messages.lang.es}
        title={messages.lang.es}
        onClick={() => setLocale('es')}
      >
        <FlagEs />
      </button>
      <button
        type="button"
        className={`lang-switch__btn${locale === 'en' ? ' is-active' : ''}`}
        aria-pressed={locale === 'en'}
        aria-label={messages.lang.en}
        title={messages.lang.en}
        onClick={() => setLocale('en')}
      >
        <FlagUs />
      </button>
    </div>,
    mount
  );
}
