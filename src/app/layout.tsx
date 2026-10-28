import type { Metadata } from 'next';
import { L2_SEO_DEFAULTS } from '@/components/landing2/content';
import { SECTIONS } from '@/data/sections';
import './base.css';

const seo = { ...L2_SEO_DEFAULTS, ...(SECTIONS['seo'] ?? {}) };
const faviconSrc = typeof seo.faviconSrc === 'string' ? seo.faviconSrc : '';

// Favicon — общий для всех страниц; title/description главной — в
// src/app/page.tsx, юридических — в своём роуте.
export const metadata: Metadata = {
  title: 'TOLK Global',
  icons: faviconSrc ? { icon: faviconSrc } : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
