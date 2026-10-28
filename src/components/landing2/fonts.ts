import { Unbounded, Onest } from 'next/font/google';

/**
 * Шрифты лендинга-2 (хендофф `docs/landing-2.zip`, README §«Типографика»):
 * Unbounded Bold — заголовки и крупные цифры, Onest 400/500/600/700 —
 * весь остальной текст и интерфейс.
 *
 * `next/font/google`, а не `next/font/local` с файлами из архива:
 * next/font скачивает и самохостит шрифт на этапе сборки (CSP
 * `font-src 'self'` в src/proxy.ts соблюдается, внешних запросов в
 * рантайме нет), при этом даёт нужные веса Onest, которых в архиве нет
 * вовсе — там лежит только `Onest-ExtraLight.ttf` (вес 200, в прототипе
 * объявлен, но фактически ни на чём не используется). Тот же приём уже
 * применяется действующим лендингом (src/components/design-system/fonts.ts).
 *
 * `subsets: ['cyrillic', 'latin']` — оба явно: в одиночку 'cyrillic' у
 * Google не содержит латиницы и цифр (ловушка описана в CLAUDE.md,
 * раздел про шрифты «Сайта»), а на лендинге латиницей набраны и бренд,
 * и названия программ (Freiberufler, Chancenkarte, Digital Nomad Visa).
 */
export const unbounded = Unbounded({
  subsets: ['cyrillic', 'latin'],
  weight: ['700'],
  variable: '--l2-font-display',
  display: 'swap',
});

export const onest = Onest({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--l2-font-text',
  display: 'swap',
});

/**
 * Класс корня лендинга-2. Переменные шрифтов навешиваются на тот же
 * элемент, где объявлены `--l2-*`-токены (landing2.css, `.l2-root`) —
 * `var(--l2-font-display)` внутри объявления резолвится на элементе с
 * этим объявлением, поэтому оба должны быть на одном узле. Квиз-оверлей
 * рендерится внутри того же поддерева (без портала), отдельно
 * навешивать не нужно.
 */
export const landing2RootClassName = `l2-root ${unbounded.variable} ${onest.variable}`;
