/** Чтение UTM-меток из текущего URL — вызывается только на клиенте. */
const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const;

export function readUtmFromLocation(): Record<string, string | undefined> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string | undefined> = {};
  for (const key of UTM_KEYS) {
    utm[key] = params.get(`utm_${key}`) ?? undefined;
  }
  return utm;
}
