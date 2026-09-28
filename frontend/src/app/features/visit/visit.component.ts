import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FaqComponent, FaqItem } from '../../shared/components/faq/faq.component';
import { MapComponent } from '../../shared/components/map/map.component';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { buildGoogleMapsDirectionsUrl } from '../../shared/utils/maps.util';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [RouterLink, ContainerComponent, SectionHeaderComponent, ButtonComponent, FaqComponent, MapComponent, TranslatePipe],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css',
})
export class VisitComponent {
  private readonly siteSettingsService = inject(SiteSettingsService);
  private readonly languageService = inject(LanguageService);

  readonly siteSettings = toSignal(this.siteSettingsService.get(), { initialValue: undefined });
  readonly directionsUrl = computed(() => buildGoogleMapsDirectionsUrl(this.siteSettings()?.address ?? ''));

  readonly faqItems = computed<FaqItem[]>(() => {
    const t = getDictionary(this.languageService.lang()).visit.faq;
    return [
      { question: t.q1, answer: t.a1 },
      { question: t.q2, answer: t.a2 },
      { question: t.q3, answer: t.a3 },
      { question: t.q4, answer: t.a4 },
    ];
  });
}
