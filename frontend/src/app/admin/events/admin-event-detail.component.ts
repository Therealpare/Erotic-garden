import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdminEventInquiryService } from '../../core/services/admin-event-inquiry.service';
import { EventInquiry, INQUIRY_STATUSES, InquiryStatus } from '../../core/models/event-inquiry.model';
import { ADMIN_INPUT, ADMIN_LABEL, STATUS_BADGE, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-event-detail.component.html',
})
export class AdminEventDetailComponent {
  private readonly inquiryService = inject(AdminEventInquiryService);
  private readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly badge = STATUS_BADGE;
  readonly statuses = INQUIRY_STATUSES;

  readonly inquiry = signal<EventInquiry | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly saved = signal(false);
  readonly error = signal<string | null>(null);

  status: InquiryStatus = 'NEW';
  adminNotes = '';

  constructor() {
    this.inquiryService.get(this.id).subscribe({
      next: (inquiry) => this.setInquiry(inquiry),
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);
    this.inquiryService.update(this.id, { status: this.status, adminNotes: this.adminNotes }).subscribe({
      next: (inquiry) => {
        this.setInquiry(inquiry);
        this.saving.set(false);
        this.saved.set(true);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  private setInquiry(inquiry: EventInquiry): void {
    this.inquiry.set(inquiry);
    this.status = inquiry.status;
    this.adminNotes = inquiry.adminNotes ?? '';
    this.loading.set(false);
  }
}
