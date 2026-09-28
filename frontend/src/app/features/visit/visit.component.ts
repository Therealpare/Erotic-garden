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

@Component({
  selector: 'app-visit',
  standalone: true,
  imports: [RouterLink, ContainerComponent, SectionHeaderComponent, ButtonComponent, FaqComponent, MapComponent],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.css',
})
export class VisitComponent {
  private readonly siteSettingsService = inject(SiteSettingsService);

  readonly siteSettings = toSignal(this.siteSettingsService.get(), { initialValue: undefined });
  readonly directionsUrl = computed(() => buildGoogleMapsDirectionsUrl(this.siteSettings()?.address ?? ''));

  readonly faqItems: FaqItem[] = [
    {
      question: 'Do I need to book in advance?',
      answer: 'TODO: OWNER VERIFIED CONTENT REQUIRED — booking policy will be confirmed here.',
    },
    {
      question: 'Is the garden suitable for children?',
      answer: 'TODO: OWNER VERIFIED CONTENT REQUIRED — visitor guidance will be confirmed here.',
    },
    {
      question: 'Is there parking on site?',
      answer: 'TODO: OWNER VERIFIED CONTENT REQUIRED — parking details will be confirmed here.',
    },
    {
      question: 'Are pets allowed?',
      answer: 'TODO: OWNER VERIFIED CONTENT REQUIRED — pet policy will be confirmed here.',
    },
  ];
}
