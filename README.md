# tolk-landing

Лендинг tolk.global (бывший «Лендинг-2» из репозитория `tolk-site`) —
статический сайт без CMS и базы данных. Вёрстка, стили, шрифты, квиз и
юридические страницы перенесены как есть; контент — снимок живого
tolk.global на 2026-10-28.

## Страницы

| Адрес                          | Файл после сборки                      |
| ------------------------------ | -------------------------------------- |
| `/`                            | `out/index.html`                       |
| `/legal`                       | `out/legal.html`                       |
| `/legal/privacy-policy`        | `out/legal/privacy-policy.html`        |
| `/legal/personal-data-consent` | `out/legal/personal-data-consent.html` |

`/?quiz=open` сразу открывает тест (на эту ссылку ведёт кнопка в шапке
юридических страниц).

## Где что править

- **Тексты, ссылки, списки, видимость секций** — `src/data/sections.json`.
  Ключи и поля те же, что были у формы CMS; типы и значения по умолчанию —
  `src/components/landing2/content.ts`. `null` у секции — показываются
  значения по умолчанию из `content.ts`; `"visible": false` прячет секцию
  вместе со ссылкой на неё в меню/подвале (у юридической страницы — не
  собирает её вовсе).
- **Тексты Политики и Реквизитов** — `src/components/landing2/legal-texts.ts`
  (в CMS их не переопределяли). Текст согласия — `consent.body` в
  `sections.json`: он же показывается в попапе у галочки квиза и уходит в
  CRM вместе с заявкой.
- **Вёрстка** — `src/components/landing2/**`, стили — `landing2.css`.
- **Картинки** — `public/landing-2/` (декор), `public/media/` (фото hero и
  favicon, скачаны с живого сайта под теми же адресами `/media/…`).

## Сборка

```bash
npm install
npm run build        # → out/
npm run serve        # локально: http://localhost:3100
```

Перед коммитом: `npm run lint && npm run typecheck && npx prettier --check .`

## Заявки из квиза

Подписывать заявку для CRM в браузере нельзя (секрет), поэтому у статики
своего обработчика нет: квиз шлёт `POST /api/lead` — тот же запрос, что и
раньше, — а принимает его по-прежнему приложение `tolk-site` (оно
собирает конверт, подписывает и отправляет в CRM; источник формы
`landing2-quiz`, настраивается в `/admin/settings` tolk-site).

Варианты подключения:

1. **Прокси на веб-сервере (по умолчанию).** Сервер, раздающий `out/`,
   проксирует `/api/lead` в приложение tolk-site. Пример для Caddy:

   ```caddy
   tolk.global {
     handle /api/lead {
       reverse_proxy <адрес приложения tolk-site>
     }
     handle {
       root * /srv/tolk-landing/out
       try_files {path} {path}.html {path}/index.html
       file_server
       handle_errors {
         rewrite * /404.html
         file_server
       }
     }
   }
   ```

   nginx: `location = /api/lead { proxy_pass …; }` и
   `try_files $uri $uri.html $uri/index.html =404;`.

2. **Другой адрес обработчика** — при сборке:
   `NEXT_PUBLIC_LEAD_ENDPOINT=https://next.tolk.global/api/lead npm run build`.
   Для чужого домена на стороне tolk-site понадобится CORS.

Проверить с прокси локально: `LEAD_PROXY=https://… npm run serve`.
Без него `/api/lead` отвечает 502 и квиз показывает экран ошибки отправки
— как живой сайт при недоступной CRM.

## Безопасность

У tolk-site заголовки (CSP с nonce, HSTS, X-Frame-Options и др.) ставило
само приложение. Статика нонсов не умеет — инлайн-скрипты гидратации Next
требуют `script-src 'self' 'unsafe-inline'` (или хешей). Остальные
заголовки задаются на веб-сервере.
