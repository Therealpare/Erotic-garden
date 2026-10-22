import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { isApiConfigured } from '../../core/config/api.config';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly apiConfigured = isApiConfigured();
  readonly expired = this.route.snapshot.queryParamMap.has('expired');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl?.startsWith('/admin') ? returnUrl : '/admin/events');
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(error, 'Sign-in failed.'));
      },
    });
  }
}
