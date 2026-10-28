'use client';

import { readUtmFromLocation } from './utm';
import type { LeadConsent, LeadField } from './lead-envelope';

export interface SubmitLeadInput {
  formId: string;
  name?: string;
  /** Ровно то, что человек вписал в поле «Telegram или email» — сервер
   *  раскладывает это в contact.{telegram|email|phone}, см. lead-envelope.ts. */
  contactRaw: string;
  fields?: LeadField[];
  consent: boolean;
  /** Поимённые согласия с текстом и временем отметки (форма с
   *  чекбоксами). Старые формы шлют только общий `consent`. */
  consents?: LeadConsent[];
}

export type SubmitLeadResult = { ok: true } | { ok: false };

/**
 * Куда уходит заявка. У статической страницы своего сервера нет, а
 * секрет подписи CRM в браузер попадать не должен — поэтому заявка
 * идёт в существующий обработчик `/api/lead` приложения tolk-site, он
 * собирает конверт, подписывает и отправляет его в CRM.
 *
 * По умолчанию путь относительный: веб-сервер, раздающий статику,
 * проксирует `/api/lead` в приложение tolk-site (см. README). Другой
 * адрес задаётся при сборке: `NEXT_PUBLIC_LEAD_ENDPOINT=https://… npm run build`
 * (для чужого домена там понадобится CORS).
 */
const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || '/api/lead';

/**
 * Browser-safe — секрет подписи сюда не попадает. Конверт (payload.
 * answers/raw, externalId, submittedAt) собирает сервер, здесь только то,
 * что физически доступно исключительно в браузере: текущий URL и UTM.
 */
export async function submitLead(input: SubmitLeadInput): Promise<SubmitLeadResult> {
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formId: input.formId,
        name: input.name,
        contactRaw: input.contactRaw,
        fields: input.fields ?? [],
        consent: input.consent,
        ...(input.consents && input.consents.length > 0 ? { consents: input.consents } : {}),
        utm: readUtmFromLocation(),
        pageUrl: window.location.href,
      }),
    });
    return res.ok ? { ok: true } : { ok: false };
  } catch {
    return { ok: false };
  }
}
