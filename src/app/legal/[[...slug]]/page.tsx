import type { Metadata } from 'next';
import { Landing2LegalPage } from '@/components/landing2/Landing2LegalPage';
import {
  LANDING2_LEGAL_PAGES,
  L2_LEGAL_DEFAULTS_BY_KEY,
  legalKeyForSlug,
  type Landing2LegalKey,
} from '@/components/landing2/content';
import { SECTIONS, isSectionVisible } from '@/data/sections';

/**
 * Юридические страницы: `/legal`, `/legal/privacy-policy`,
 * `/legal/personal-data-consent`. Собираются только видимые — выключенная
 * страница в экспорт не попадает (на сервере это 404).
 */
export const dynamicParams = false;

export function generateStaticParams(): { slug: string[] }[] {
  return LANDING2_LEGAL_PAGES.filter((page) => isSectionVisible(page.key)).map((page) => ({
    slug: page.path.split('/').slice(2),
  }));
}

interface Props {
  params: Promise<{ slug?: string[] }>;
}

async function resolveKey(params: Props['params']): Promise<Landing2LegalKey> {
  const { slug } = await params;
  const key = legalKeyForSlug(slug);
  if (!key) throw new Error(`Неизвестная юридическая страница: ${slug?.join('/')}`);
  return key;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = await resolveKey(params);
  const title =
    (SECTIONS[key]?.['title'] as string | undefined) ?? L2_LEGAL_DEFAULTS_BY_KEY[key].title;
  return { title: `${title} — TOLK Global` };
}

export default async function LegalPage({ params }: Props) {
  const key = await resolveKey(params);
  return <Landing2LegalPage sections={SECTIONS} legalKey={key} />;
}
