import { Component, ElementRef, HostListener, Input, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lang, LanguageService } from '../../../core/i18n/language.service';

interface LanguageOption {
  code: Lang;
  short: string;
  /** Native name, so each visitor recognises their own language whatever is currently selected. */
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'th', short: 'TH', label: 'ไทย' },
  { code: 'de', short: 'DE', label: 'Deutsch' },
];

const MENU_LABEL: Record<Lang, string> = {
  en: 'Select language',
  th: 'เลือกภาษา',
  de: 'Sprache wählen',
};

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
})
export class LanguageSwitcherComponent {
  readonly languageService = inject(LanguageService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Which edge the menu lines up with: right in the desktop bar, left in the mobile menu. */
  @Input() align: 'left' | 'right' = 'right';

  readonly languages = LANGUAGES;
  readonly isOpen = signal(false);
  readonly current = computed(
    () => LANGUAGES.find((option) => option.code === this.languageService.lang()) ?? LANGUAGES[0],
  );
  readonly menuLabel = computed(() => MENU_LABEL[this.languageService.lang()]);

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  select(lang: Lang): void {
    // Only the language signal changes, so the current route, form input and loaded data stay put.
    this.languageService.setLang(lang);
    this.close(true);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.open();
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    const items = this.optionButtons();
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
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
        this.close();
        break;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close(true);
  }

  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: EventTarget | null): void {
    if (this.isOpen() && !this.host.nativeElement.contains(target as Node)) this.close();
  }

  private open(): void {
    this.isOpen.set(true);
    // Wait for the menu to render, then focus the selected language.
    setTimeout(() => {
      const items = this.optionButtons();
      (items.find((item) => item.getAttribute('aria-checked') === 'true') ?? items[0])?.focus();
    });
  }

  private close(restoreFocus = false): void {
    this.isOpen.set(false);
    if (restoreFocus) {
      this.host.nativeElement.querySelector<HTMLButtonElement>('[data-lang-trigger]')?.focus();
    }
  }

  private optionButtons(): HTMLButtonElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
  }
}
