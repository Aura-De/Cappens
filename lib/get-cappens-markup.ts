import { cappensMarkup as markupEs } from '@/lib/cappens-markup';
import enReplacements from '@/messages/markup-en.json';
import type { Locale } from '@/lib/i18n/types';

export function getCappensMarkup(locale: Locale): string {
  if (locale === 'es') return markupEs;
  let html = markupEs;
  const pairs = [...(enReplacements as [string, string][])].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of pairs) {
    if (from && html.includes(from)) html = html.split(from).join(to);
  }
  return html;
}
