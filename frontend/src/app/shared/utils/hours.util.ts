import { Lang } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

/** Translates the known day/closed labels returned by SiteSettingsService; unrecognized values pass through untranslated. */
export function translateHoursDay(lang: Lang, days: string): string {
  const t = getDictionary(lang).hours;
  const key = days.toLowerCase() as keyof typeof t;
  return key !== 'closed' && key in t ? t[key] : days;
}

export function translateHoursValue(lang: Lang, hours: string): string {
  const t = getDictionary(lang).hours;
  return hours === 'Closed' ? t.closed : hours;
}
