import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AdminMediaService } from '../../core/services/admin-media.service';
import { MEDIA_TYPES, MediaItem, MediaStatus, MediaType } from '../../core/models/media.model';
import { ADMIN_INPUT, ADMIN_LABEL, STATUS_BADGE, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-media-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-media-list.component.html',
})
export class AdminMediaListComponent {
  private readonly mediaService = inject(AdminMediaService);
  private readonly auth = inject(AuthService);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly badge = STATUS_BADGE;
  readonly types = MEDIA_TYPES;

  readonly items = signal<MediaItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pendingDeleteId = signal<number | null>(null);
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  typeFilter: MediaType | '' = '';
  statusFilter: MediaStatus | '' = '';

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaService
      .list({ type: this.typeFilter || undefined, status: this.statusFilter || undefined })
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
      });
  }

  /** Inline two-step confirmation; browser confirm() dialogs are avoided on purpose. */
  confirmDelete(item: MediaItem): void {
    this.mediaService.remove(item.id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.items.update((items) => items.filter((existing) => existing.id !== item.id));
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }
}
