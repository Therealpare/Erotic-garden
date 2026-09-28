import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ExperienceService } from '../../core/services/experience.service';
import { BookingService } from '../../core/services/booking.service';
import { BookingConfirmation } from '../../core/models/booking.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

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
export class BookingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly experienceService = inject(ExperienceService);
  private readonly bookingService = inject(BookingService);
  private readonly languageService = inject(LanguageService);

  private readonly rawExperiences = toSignal(this.experienceService.getAll(), { initialValue: [] });

  readonly experiences = computed(() => {
    const items = getDictionary(this.languageService.lang()).experience.items as Record<string, { title: string }>;
    return this.rawExperiences().map((experience) => {
      const translated = items[experience.slug];
      return translated ? { ...experience, title: translated.title } : experience;
    });
  });

  readonly state = signal<SubmitState>('idle');
  readonly confirmation = signal<BookingConfirmation | undefined>(undefined);

  readonly today = new Date().toISOString().split('T')[0];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    visitDate: ['', [Validators.required, notPastDateValidator]],
    preferredTime: ['', [Validators.required]],
    guestCount: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
    experienceId: [null as number | null, [Validators.required]],
    message: [''],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    this.bookingService.submit(this.form.getRawValue()).subscribe({
      next: (confirmation) => {
        this.confirmation.set(confirmation);
        this.state.set('success');
        this.form.reset({ guestCount: 2 });
      },
      error: () => this.state.set('error'),
    });
  }

  startNewBooking(): void {
    this.state.set('idle');
    this.confirmation.set(undefined);
  }

  fieldInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
