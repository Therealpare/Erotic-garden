import { Injectable, signal } from '@angular/core';

export type Lang = 'en' | 'th';

const STORAGE_KEY = 'eg-lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal<Lang>(this.readInitialLang());

  setLang(lang: Lang): void {
    this.lang.set(lang);
    this.persist(lang);
  }

  toggle(): void {
    this.setLang(this.lang() === 'en' ? 'th' : 'en');
  }

  private readInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'th' ? 'th' : 'en';
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
