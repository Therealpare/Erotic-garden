import { Injectable, signal } from '@angular/core';

export type Lang = 'en' | 'th' | 'de';

const STORAGE_KEY = 'eg-lang';
const VALID_LANGS: Lang[] = ['en', 'th', 'de'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>(this.readInitialLang());

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.persist(lang);
  }

  toggle(): void {
    const order: Lang[] = ['en', 'th', 'de'];
    const next = order[(order.indexOf(this.lang()) + 1) % order.length];
    this.setLang(next);
  }

  private readInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return VALID_LANGS.includes(stored as Lang) ? (stored as Lang) : 'en';
    } catch {
      return 'en';
    }
  }

  private persist(lang: Lang): void {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable — language choice just won't persist across visits.
    }
  }
}
