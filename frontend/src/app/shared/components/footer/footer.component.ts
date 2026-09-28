import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../container/container.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';

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

  readonly year = new Date().getFullYear();

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

  // TODO: OWNER VERIFIED CONTENT REQUIRED — replace with real values via site-settings API.
  readonly address = 'TODO: OWNER VERIFIED CONTENT REQUIRED — Mae Rim, Chiang Mai, Thailand';
  readonly email = 'TODO: OWNER VERIFIED CONTENT REQUIRED';
  readonly phone = 'TODO: OWNER VERIFIED CONTENT REQUIRED';
}
