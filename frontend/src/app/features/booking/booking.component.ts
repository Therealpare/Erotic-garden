import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { lineMessageUrl, openLine } from '../../core/config/line.config';
import { composeLineMessage, formatVisitDate, lineLabels } from '../../shared/utils/line-message.util';

function notPastDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(control.value);
  return selected < today ? { pastDate: true } : null;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ContainerComponent, ButtonComponent, TranslatePipe],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
/** Visit booking request, sent to the garden's LINE account as a typed-in message. */
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);

  /** The LINE link of the last request, for "Open LINE again". */
  readonly sentUrl = signal<string | null>(null);

  readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.email, Validators.maxLength(255)]],
    phone: ['', [Validators.pattern(/^[+\d][\d\s()-]{5,38}$/)]],
    visitDate: ['', [Validators.required, notPastDateValidator]],
    preferredTime: [''],
    guestCount: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
    message: ['', [Validators.maxLength(1000)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
        [t.phone, value.phone],
        [t.email, value.email],
        [t.note, value.message],
      ]),
    );
    this.sentUrl.set(url);
    openLine(url);
  }

  startNewBooking(): void {
    this.sentUrl.set(null);
    this.form.reset({ guestCount: 2 });
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
