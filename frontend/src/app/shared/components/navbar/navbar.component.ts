import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ContainerComponent } from '../container/container.component';
import { ButtonComponent } from '../button/button.component';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ContainerComponent,
    ButtonComponent,
    LanguageSwitcherComponent,
    TranslatePipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly languageService = inject(LanguageService);

  isMenuOpen = signal(false);

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

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
