import { Lang } from './language.service';
import { EN } from './en';
import { TH } from './th';
import { DE } from './de';

export { EN, TH, DE };
export type Dictionary = typeof EN;

const DICTIONARIES: Record<Lang, Dictionary> = { en: EN, th: TH, de: DE };

function lookup(dict: Dictionary, key: string): unknown {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

/** Looks up a dot-path key (e.g. "home.hero.headline") in the given language, falling back to English. */
export function getTranslation(lang: Lang, key: string): string {
  const value = lookup(DICTIONARIES[lang], key);
  if (typeof value === 'string') return value;

  const fallback = lookup(EN, key);
  return typeof fallback === 'string' ? fallback : key;
}

/** Returns the whole dictionary for a language — for structured/array content read directly in component code. */
export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARIES[lang];
}
