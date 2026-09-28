import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContainerComponent } from '../container/container.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';
import { SiteSettingsService } from '../../../core/services/site-settings.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly languageService = inject(LanguageService);
  private readonly siteSettingsService = inject(SiteSettingsService);

  readonly year = new Date().getFullYear();

  readonly siteSettings = toSignal(this.siteSettingsService.get(), { initialValue: undefined });

  readonly links = computed<NavLink[]>(() => {
    const t = getDictionary(this.languageService.lang()).nav;
    return [
      { label: t.about, path: '/about' },
      { label: t.experience, path: '/experience' },
      { label: t.art, path: '/art' },
      { label: t.gallery, path: '/gallery' },
      { label: t.teaHouse, path: '/tea-house' },
      { label: t.visit, path: '/visit' },
    ];
  });
}
