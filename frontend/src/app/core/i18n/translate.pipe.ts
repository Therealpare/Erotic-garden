import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from './language.service';
import { getTranslation } from './dictionaries';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(key: string): string {
    return getTranslation(this.languageService.lang(), key);
  }
}
