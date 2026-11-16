import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { lineMessageUrl, openLine } from '../../core/config/line.config';
import { composeLineMessage, lineLabels } from '../../shared/utils/line-message.util';

/** Contact form, sent to the garden's LINE account as a typed-in message. */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ButtonComponent, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);

  /** The LINE link of the last message, for "Open LINE again". */
  readonly sentUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.email, Validators.maxLength(255)]],
    subject: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(160)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const t = lineLabels(this.languageService.lang());
    const value = this.form.getRawValue();
    const url = lineMessageUrl(
      composeLineMessage(t.contact, [
        [t.name, value.name],
        [t.email, value.email],
        [t.subject, value.subject],
      ], ['', value.message.trim()]),
    );
    this.sentUrl.set(url);
    openLine(url);
  }

  startOver(): void {
    this.sentUrl.set(null);
    this.form.reset();
  }

  fieldInvalid(name: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
