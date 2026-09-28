import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ContactService } from '../../core/services/contact.service';
import { TranslatePipe } from '../../core/i18n/translate.pipe';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ContainerComponent, ButtonComponent, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);

  readonly state = signal<SubmitState>('idle');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(2)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    this.contactService.submit(this.form.getRawValue()).subscribe({
      next: () => {
        this.state.set('success');
        this.form.reset();
      },
      error: () => this.state.set('error'),
    });
  }

  fieldInvalid(name: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }
}
