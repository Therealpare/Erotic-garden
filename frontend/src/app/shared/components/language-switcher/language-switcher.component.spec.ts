import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from '../../../core/i18n/language.service';
import { LanguageSwitcherComponent } from './language-switcher.component';

describe('LanguageSwitcherComponent', () => {
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let element: HTMLElement;
  let language: LanguageService;

  const trigger = () => element.querySelector<HTMLButtonElement>('[data-lang-trigger]')!;
  const options = () => Array.from(element.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [LanguageSwitcherComponent] });
    language = TestBed.inject(LanguageService);
    language.lang.set('en');
    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('shows only the current language while closed', () => {
    expect(trigger().textContent).toContain('EN');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(options().length).toBe(0);
  });

  it('lists all three languages by native name when opened', () => {
    trigger().click();
    fixture.detectChanges();
    expect(options().map((option) => option.querySelector('span')?.textContent)).toEqual(['English', 'ไทย', 'Deutsch']);
    expect(options()[0].getAttribute('aria-checked')).toBe('true');
  });

  it('switches language and closes the menu', () => {
    trigger().click();
    fixture.detectChanges();
    options()[1].click();
    fixture.detectChanges();
    expect(language.lang()).toBe('th');
    expect(trigger().textContent).toContain('TH');
    expect(options().length).toBe(0);
  });

  it('closes on an outside click and on Escape', () => {
    trigger().click();
    fixture.detectChanges();
    document.body.click();
    fixture.detectChanges();
    expect(options().length).toBe(0);

    trigger().click();
    fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(options().length).toBe(0);
  });
});
