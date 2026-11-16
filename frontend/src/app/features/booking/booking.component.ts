import { Component, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { lineLinkTarget, lineMessageUrl, openLine } from '../../core/config/line.config';
import { composeLineMessage, formatVisitDate, lineLabels } from '../../shared/utils/line-message.util';
import { notInPast, todayIso } from '../checkout/checkout.component';
import {
  DEFAULT_COUNTRY,
  countriesFor,
  countryFromLocale,
  dialCodeOf,
  flagOf,
  internationalNumber,
} from '../../shared/utils/country-codes';

/** Handled by the site's Cloudflare Worker (frontend/worker/index.ts), which alerts staff on LINE. */
const BOOKING_ENDPOINT = '/api/booking';

export type ContactPreference = 'EMAIL' | 'WHATSAPP' | 'PHONE' | 'LINE';
type SubmitState = 'idle' | 'loading' | 'error' | 'rate-limited';

/** The contact detail for the chosen way of replying must be filled in. */
function contactForPreference(group: AbstractControl): ValidationErrors | null {
  const value = group.value as { email: string; phone: string; lineId: string; contactPreference: ContactPreference };
  const needed = { EMAIL: value.email, WHATSAPP: value.phone, PHONE: value.phone, LINE: value.lineId }[value.contactPreference];
  return needed?.trim() ? null : { contactMissing: true };
}

/**
 * Visit booking request. Two ways to send, both confirmed by staff afterwards:
 * - the form (no LINE needed, for overseas guests): the Worker pushes an alert to the
 *   garden's LINE Official Account and the guest gets a reference code;
 * - "Send via LINE chat": opens LINE with the request typed in.
 */
@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, ButtonComponent, TranslatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);
  private readonly languageService = inject(LanguageService);

  readonly state = signal<SubmitState>('idle');
  /** Reference code returned after the request reached staff. */
  readonly reference = signal<string | null>(null);
  /** The LINE link of the last "Send via LINE" request, for "Open LINE again". */
  readonly sentUrl = signal<string | null>(null);
  readonly lineTarget = lineLinkTarget();
  readonly preferences: ContactPreference[] = ['EMAIL', 'WHATSAPP', 'PHONE', 'LINE'];
  readonly today = todayIso();
  /** Country list for the phone field, named in the page language. */
  readonly countries = computed(() => countriesFor(this.languageService.lang()));

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      visitDate: ['', [Validators.required, notInPast]],
      preferredTime: ['', [Validators.pattern(/^([01]\d|2[0-3]):[0-5]\d$/)]],
      guestCount: [2, [Validators.required, Validators.min(1), Validators.max(50)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      phoneCountry: [DEFAULT_COUNTRY],
      /** Number without the country code; a number typed with its own "+" is also accepted. */
      phone: ['', [Validators.pattern(/^\+?\d[\d\s()-]{4,30}$/)]],
      lineId: ['', [Validators.maxLength(60)]],
      contactPreference: ['EMAIL' as ContactPreference],
      message: ['', [Validators.maxLength(1000)]],
      consent: [false, [Validators.requiredTrue]],
      website: [''],
    },
    { validators: contactForPreference },
  );

  constructor() {
    // Guests usually give their home number: start from the browser's country (e.g. de-DE → +49).
    afterNextRender(() => {
      const control = this.form.controls.phoneCountry;
      const country = countryFromLocale(navigator.language);
      if (country && control.pristine) control.setValue(country);
    });
  }

  /** "🇹🇭 +66" for the closed picker. */
  phoneCountryLabel(): string {
    const code = this.form.controls.phoneCountry.value;
    return `${flagOf(code)} +${dialCodeOf(code) ?? ''}`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const value = this.form.getRawValue();
    this.state.set('loading');
    this.http
      .post<{ reference: string }>(BOOKING_ENDPOINT, {
        name: value.name.trim(),
        visitDate: value.visitDate,
        preferredTime: value.preferredTime,
        guestCount: Number(value.guestCount),
        email: value.email.trim(),
        phone: internationalNumber(value.phoneCountry, value.phone),
        lineId: value.lineId.trim(),
        contactPreference: value.contactPreference,
        message: value.message.trim(),
        language: this.languageService.lang(),
        website: value.website,
      })
      .subscribe({
        next: ({ reference }) => {
          this.reference.set(reference);
          this.state.set('idle');
          afterNextRender(() => document.getElementById('booking-done')?.focus(), { injector: this.injector });
        },
        error: (error: unknown) =>
          this.state.set(error instanceof HttpErrorResponse && error.status === 429 ? 'rate-limited' : 'error'),
      });
  }

  /** Alternative for guests with LINE: only name, date and guests are needed. */
  sendViaLine(): void {
    const required = [this.form.controls.name, this.form.controls.visitDate, this.form.controls.guestCount];
    if (required.some((control) => control.invalid)) {
      required.forEach((control) => control.markAsTouched());
      this.focusFirstInvalid();
      return;
    }
    const lang = this.languageService.lang();
    const t = lineLabels(lang);
    const value = this.form.getRawValue();
    const url = lineMessageUrl(
      composeLineMessage(t.booking, [
        [t.name, value.name],
        [t.visitDate, formatVisitDate(value.visitDate, lang)],
        [t.time, value.preferredTime],
        [t.guests, value.guestCount],
        [t.phone, internationalNumber(value.phoneCountry, value.phone)],
        [t.email, value.email],
        [t.note, value.message],
      ]),
    );
    this.sentUrl.set(url);
    openLine(url);
  }

  startNewBooking(): void {
    this.reference.set(null);
    this.sentUrl.set(null);
    this.state.set('idle');
    this.form.reset({ guestCount: 2, contactPreference: 'EMAIL', phoneCountry: this.form.controls.phoneCountry.value });
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  /** Shown once the guest has tried to submit and the chosen contact detail is empty. */
  contactMissing(): boolean {
    const controls = this.form.controls;
    return this.form.hasError('contactMissing') && (controls.email.touched || controls.phone.touched || controls.consent.touched);
  }

  private focusFirstInvalid(): void {
    afterNextRender(() => document.querySelector<HTMLElement>('#booking-form [aria-invalid="true"]')?.focus(), {
      injector: this.injector,
    });
  }
}
