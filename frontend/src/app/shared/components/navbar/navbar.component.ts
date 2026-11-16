import { Component, ElementRef, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
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

interface NavMenu {
  /** Top-level items: About, Experience, Coffee, then the "Explore" menu, then Visit. */
  before: NavLink[];
  explore: NavLink[];
  after: NavLink[];
}

/**
 * Site header. Kept to five top-level items so the bar stays calm: the less-visited pages
 * (Art, Gallery, Media, Events) sit under one "Explore" dropdown. The Tea House page is
 * reached from the home page and the footer.
 */
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
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  isMenuOpen = signal(false);
  readonly isExploreOpen = signal(false);

  readonly menu = computed<NavMenu>(() => {
    const t = getDictionary(this.languageService.lang()).nav;
    return {
      before: [
        { label: t.about, path: '/about' },
        { label: t.experience, path: '/experience' },
        { label: t.coffee, path: '/coffee' },
      ],
      explore: [
        { label: t.art, path: '/art' },
        { label: t.gallery, path: '/gallery' },
        { label: t.media, path: '/media' },
        { label: t.events, path: '/events' },
      ],
      after: [{ label: t.visit, path: '/visit' }],
    };
  });
  readonly exploreLabel = computed(() => getDictionary(this.languageService.lang()).nav.explore);

  /** The current page is one of the Explore pages, so the trigger is highlighted. */
  readonly exploreActive = signal(false);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const path = event.urlAfterRedirects.split(/[?#]/)[0];
        this.exploreActive.set(['/art', '/gallery', '/media', '/events'].some((p) => path === p || path.startsWith(p + '/')));
        this.isExploreOpen.set(false);
      });
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleExplore(): void {
    if (this.isExploreOpen()) {
      this.closeExplore();
    } else {
      this.openExplore();
    }
  }

  onExploreTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.openExplore();
    }
  }

  onExploreMenuKeydown(event: KeyboardEvent): void {
    const items = this.exploreItems();
    const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case 'Tab':
        this.closeExplore();
        break;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isExploreOpen()) this.closeExplore(true);
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    const explore = this.host.nativeElement.querySelector('[data-explore]');
    if (this.isExploreOpen() && !explore?.contains(target as Node)) this.closeExplore();
  }

  private openExplore(): void {
    this.isExploreOpen.set(true);
    setTimeout(() => this.exploreItems()[0]?.focus());
  }

  private closeExplore(restoreFocus = false): void {
    this.isExploreOpen.set(false);
    if (restoreFocus) this.host.nativeElement.querySelector<HTMLButtonElement>('[data-explore-trigger]')?.focus();
  }

  private exploreItems(): HTMLAnchorElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLAnchorElement>('[data-explore] [role="menuitem"]'));
  }
}
