import { Component, DestroyRef, Injector, afterNextRender, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { EventInquiryService } from '../../core/services/event-inquiry.service';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';
import { lineLinkTarget, lineMessageUrl, openLine } from '../../core/config/line.config';
import { composeLineMessage, formatVisitDate, lineLabels } from '../../shared/utils/line-message.util';
import {
  CONTACT_PREFERENCES,
  ContactPreference,
  EVENT_TYPES,
  EventType,
} from '../../core/models/event-inquiry.model';

type SubmitState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function notInPast(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && control.value < todayIso() ? { past: true } : null;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ContainerComponent, SectionHeaderComponent, ButtonComponent, TranslatePipe],
  templateUrl: './events.component.html',
})
export class EventsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly inquiryService = inject(EventInquiryService);
  private readonly injector = inject(Injector);

  private readonly languageService = inject(LanguageService);

  /** Without the API (the live site) the inquiry is sent to the garden's LINE account instead. */
  readonly viaLine = !this.inquiryService.isAvailable();
  /** The LINE link of the last inquiry, for "Open LINE again". */
  readonly sentUrl = signal<string | null>(null);
  readonly lineTarget = lineLinkTarget();
  readonly state = signal<SubmitState>('idle');
  readonly referenceCode = signal<string | null>(null);
  readonly minDate = todayIso();
  readonly eventTypes = EVENT_TYPES;
  readonly contactPreferences = CONTACT_PREFERENCES;
  readonly steps = [1, 2, 3] as const;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s()-]{5,38}$/)]],
    organization: ['', [Validators.maxLength(160)]],
    eventType: ['' as EventType | '', [Validators.required]],
    preferredDate: ['', [Validators.required, notInPast]],
    flexibleDate: [false],
    guestCount: [null as number | null, [Validators.required, Validators.min(1), Validators.max(1000)]],
    contactPreference: ['EMAIL' as ContactPreference],
    lineId: ['', [Validators.maxLength(60)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
    consent: [false, [Validators.requiredTrue]],
    website: [''],
  });

  constructor() {
    // LINE ID is only required when the visitor asks to be contacted on LINE.
    this.form.controls.contactPreference.valueChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((preference) => {
        const lineId = this.form.controls.lineId;
        lineId.setValidators(
          preference === 'LINE' ? [Validators.required, Validators.maxLength(60)] : [Validators.maxLength(60)],
        );
        lineId.updateValueAndValidity();
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }

    const value = this.form.getRawValue();
    if (this.viaLine) {
      this.sendViaLine(value);
      return;
    }
    this.state.set('loading');
    this.inquiryService
      .submit({
        name: value.name.trim(),
        email: value.email.trim(),
        phone: value.phone.trim(),
        organization: value.organization.trim() || undefined,
        eventType: value.eventType as EventType,
        preferredDate: value.preferredDate,
        flexibleDate: value.flexibleDate,
        guestCount: Number(value.guestCount),
        contactPreference: value.contactPreference,
        lineId: value.contactPreference === 'LINE' ? value.lineId.trim() : undefined,
        message: value.message.trim(),
        consent: value.consent,
        website: value.website || undefined,
      })
      .subscribe({
        next: (receipt) => {
          this.referenceCode.set(receipt.referenceCode);
          this.state.set('success');
          this.form.reset();
          afterNextRender(() => document.getElementById('inquiry-success')?.focus(), { injector: this.injector });
        },
        error: (error: unknown) =>
          this.state.set(error instanceof HttpErrorResponse && error.status === 429 ? 'rate-limited' : 'error'),
      });
  }

  startOver(): void {
    this.referenceCode.set(null);
    this.sentUrl.set(null);
    this.state.set('idle');
  }

  private sendViaLine(value: ReturnType<typeof this.form.getRawValue>): void {
    const lang = this.languageService.lang();
    const t = lineLabels(lang);
    const types = getDictionary(lang === 'th' ? 'th' : 'en').events.form.eventTypes as Record<string, string>;
    const date = formatVisitDate(value.preferredDate, lang) + (value.flexibleDate ? ` (${t.flexible})` : '');
    const url = lineMessageUrl(
      composeLineMessage(
        t.event,
        [
          [t.name, value.name],
          [t.organization, value.organization],
          [t.eventType, types[value.eventType] ?? value.eventType],
          [t.visitDate, date],
          [t.guests, value.guestCount],
          [t.phone, value.phone],
          [t.email, value.email],
        ],
        ['', value.message.trim()],
      ),
    );
    this.sentUrl.set(url);
    openLine(url);
    afterNextRender(() => document.getElementById('inquiry-sent')?.focus(), { injector: this.injector });
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  /** Runs after Angular has re-rendered, so aria-invalid is already set on the fields. */
  private focusFirstInvalid(): void {
    afterNextRender(
      () => document.querySelector<HTMLElement>('#event-inquiry-form [aria-invalid="true"]')?.focus(),
      { injector: this.injector },
    );
  }
}
