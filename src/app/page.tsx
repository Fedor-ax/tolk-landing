import type { Metadata } from 'next';
import { Landing2Page } from '@/components/landing2/Landing2Page';
import { L2_SEO_DEFAULTS } from '@/components/landing2/content';
import { SECTIONS } from '@/data/sections';

const seo = { ...L2_SEO_DEFAULTS, ...(SECTIONS['seo'] ?? {}) };

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
};

export default function HomePage() {
  return <Landing2Page sections={SECTIONS} />;
}
