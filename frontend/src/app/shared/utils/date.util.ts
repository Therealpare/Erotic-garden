import { Lang } from '../../core/i18n/language.service';

const LOCALES: Record<Lang, string> = { en: 'en-GB', th: 'th-TH', de: 'de-DE' };

/** Formats a calendar date (YYYY-MM-DD) for display without shifting it across time zones. */
export function formatCalendarDate(isoDate: string, lang: Lang): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(LOCALES[lang], { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}
