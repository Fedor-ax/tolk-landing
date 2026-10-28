import raw from './sections.json';
import type { Landing2Sections } from '@/components/landing2/Landing2Page';

/**
 * Контент лендинга — снимок всех секций с tolk.global на момент переноса
 * из CMS (раздел «Лендинг-2» репозитория tolk-site). Правится прямо в
 * `sections.json`; ключи и поля — те же, что были у формы CMS, типы — в
 * `src/components/landing2/content.ts`.
 *
 * `null` у секции — в CMS её ни разу не сохраняли, показываются дефолты
 * из `content.ts` (так было и на живом сайте). `visible: false` прячет
 * секцию (и ссылку на неё в меню/подвале).
 */

/**
 * Пустые значения не затирают текст по умолчанию: дефолты компонентов —
 * обычные значения параметров и срабатывают только на `undefined`.
 * Массивы не трогаем — пустой список это осознанное «ничего не
 * показывать». Та же функция, что была в CMS-версии (`stripEmpty`).
 */
function stripEmpty(values: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!values) return null;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && !value.trim()) continue;
    result[key] = value;
  }
  return result;
}

export const SECTIONS: Landing2Sections = Object.fromEntries(
  Object.entries(raw as Record<string, Record<string, unknown> | null>).map(([key, value]) => [
    key,
    stripEmpty(value),
  ]),
);

/** Секция показывается, если она явно не выключена. */
export function isSectionVisible(key: string): boolean {
  return SECTIONS[key]?.['visible'] !== false;
}
