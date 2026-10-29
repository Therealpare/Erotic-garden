import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { LocalizedText } from '../../core/models/localized-text.model';

/** Picks the current language from a LocalizedText, falling back to English. */
export function pickLocalized(value: Partial<LocalizedText> | string | null | undefined, lang: keyof LocalizedText): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || '';
}

@Pipe({ name: 'localized', standalone: true, pure: false })
export class LocalizedPipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: Partial<LocalizedText> | string | null | undefined): string {
    return pickLocalized(value, this.languageService.lang());
  }
}
