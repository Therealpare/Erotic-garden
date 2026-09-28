import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { ExperienceService } from '../../core/services/experience.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, ButtonComponent, ImageRevealComponent, TranslatePipe],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  private readonly experienceService = inject(ExperienceService);
  private readonly languageService = inject(LanguageService);

  private readonly rawExperiences = toSignal(this.experienceService.getAll(), { initialValue: [] });

  readonly experiences = computed(() => {
    const items = getDictionary(this.languageService.lang()).experience.items as Record<
      string,
      { title: string; shortDescription: string }
    >;
    return this.rawExperiences().map((experience) => {
      const translated = items[experience.slug];
      return translated ? { ...experience, title: translated.title, shortDescription: translated.shortDescription } : experience;
    });
  });
}
