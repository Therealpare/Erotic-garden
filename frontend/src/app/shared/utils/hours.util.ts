import { Lang } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

/** Translates the known day-range/closed labels returned by SiteSettingsService; unrecognized values pass through untranslated. */
export function translateHoursDay(lang: Lang, days: string): string {
  const t = getDictionary(lang).hours;
  if (days === 'Monday–Tuesday') return t.mondayTuesday;
  if (days === 'Wednesday–Sunday') return t.wednesdaySunday;
  return days;
}

export function translateHoursValue(lang: Lang, hours: string): string {
  const t = getDictionary(lang).hours;
  return hours === 'Closed' ? t.closed : hours;
}
