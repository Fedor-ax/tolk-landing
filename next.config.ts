import type { NextConfig } from 'next';

/**
 * Статический экспорт: `npm run build` кладёт готовый сайт в `out/` —
 * обычные HTML/CSS/JS/картинки, которые раздаёт любой веб-сервер
 * (nginx, Caddy, S3/CDN). Ни Node-процесса, ни базы данных в рантайме.
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
