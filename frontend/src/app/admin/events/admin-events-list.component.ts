import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminEventInquiryService } from '../../core/services/admin-event-inquiry.service';
import { EventInquiry, INQUIRY_STATUSES, InquiryStatus } from '../../core/models/event-inquiry.model';
import { ADMIN_INPUT, ADMIN_LABEL, STATUS_BADGE, apiErrorMessage } from '../admin-ui';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-admin-events-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-events-list.component.html',
})
export class AdminEventsListComponent {
  private readonly inquiryService = inject(AdminEventInquiryService);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly badge = STATUS_BADGE;
  readonly statuses = INQUIRY_STATUSES;

  readonly items = signal<EventInquiry[]>([]);
  readonly total = signal(0);
  readonly page = signal(1);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));

  statusFilter: InquiryStatus | '' = '';
  search = '';

  constructor() {
    this.load();
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  goToPage(page: number): void {
    this.page.set(page);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.inquiryService
      .list({ status: this.statusFilter || undefined, search: this.search, page: this.page(), limit: PAGE_SIZE })
      .subscribe({
        next: (result) => {
          this.items.set(result.items);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
      });
  }
}
