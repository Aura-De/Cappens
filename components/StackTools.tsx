'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  siGmail,
  siGoogledrive,
  siWhatsapp,
  siTelegram,
  siStripe,
  siSupabase,
  siHubspot,
  type SimpleIcon,
} from 'simple-icons';

const TOOLS: { icon: SimpleIcon; label: string }[] = [
  { icon: siGmail, label: 'Gmail' },
  { icon: siGoogledrive, label: 'Drive' },
  { icon: siWhatsapp, label: 'WhatsApp' },
  { icon: siTelegram, label: 'Telegram' },
  { icon: siStripe, label: 'Stripe' },
  { icon: siSupabase, label: 'Supabase' },
  { icon: siHubspot, label: 'HubSpot' },
];

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" className="stack-tools__svg" role="img" aria-hidden="true">
      <path fill={`#${icon.hex}`} d={icon.path} />
    </svg>
  );
}

type StackToolsProps = {
  locale: string;
};

export function StackTools({ locale }: StackToolsProps) {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMount(document.getElementById('stack-tools-mount'));
  }, [locale]);

  if (!mount) return null;

  return createPortal(
    <div className="stack-tools reveal" style={{ ['--r' as string]: 4 }}>
      <ul className="stack-tools__list">
        {TOOLS.map(({ icon, label }) => (
          <li key={icon.slug}>
            <span className="stack-tools__pill">
              <span className="stack-tools__icon">
                <BrandIcon icon={icon} />
              </span>
              <span className="stack-tools__name">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>,
    mount
  );
}
