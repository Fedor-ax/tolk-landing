/**
 * Типы полей заявки — та же форма, что принимает `/api/lead` в
 * репозитории tolk-site (там `src/lib/lead-envelope.ts`): конверт для CRM
 * собирает сервер, статическая страница шлёт только ответы и согласия.
 */
export interface LeadField {
  /** Стабильный ascii-ключ — для правил разбора в CRM (`payload.raw.<key>`). */
  key: string;
  /** Русский заголовок — попадает в `answers`, его читает менеджер. */
  label: string;
  value: string | number | boolean | null;
}

export interface LeadConsent {
  /** Стабильный ascii-ключ: personal_data, cross_border_ru. */
  key: string;
  /** Короткая подпись для менеджера в комментарии лида. */
  label: string;
  granted: boolean;
  /** ISO-время, когда человек поставил галочку (часы браузера). */
  at: string;
  /** Версия формулировки. */
  version: string;
  /** Текст согласия ровно в той редакции, что была на экране. */
  text: string;
}

/** Ключ согласия, из которого сервер заполняет `consent.*` конверта CRM. */
export const PRIMARY_CONSENT_KEY = 'personal_data';
