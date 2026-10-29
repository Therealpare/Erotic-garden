import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { ApiTeaCategory, ApiTeaMenuItem, MENU_ITEM_STATUSES, MenuItemStatus } from '../../core/models/tea-menu.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { ADMIN_INPUT, apiErrorMessage } from '../admin-ui';

export const MENU_STATUS_LABEL: Record<MenuItemStatus, string> = {
  AVAILABLE: 'Available',
  SOLD_OUT: 'Sold out',
  HIDDEN: 'Hidden',
};

@Component({
  selector: 'app-admin-tea-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-tea-list.component.html',
})
export class AdminTeaListComponent {
  private readonly catalog = inject(AdminCatalogService);
  private readonly auth = inject(AuthService);

  readonly inputClass = ADMIN_INPUT;
  readonly resolve = resolveImageUrl;
  readonly statuses = MENU_ITEM_STATUSES;
  readonly statusLabel = MENU_STATUS_LABEL;

  readonly items = signal<ApiTeaMenuItem[]>([]);
  readonly categories = signal<ApiTeaCategory[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly savingId = signal<number | null>(null);
  readonly pendingDeleteId = signal<number | null>(null);
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly groups = computed(() =>
    this.categories().map((category) => ({ category, items: this.items().filter((item) => item.categoryId === category.id) })),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin([this.catalog.teaItems(), this.catalog.teaCategories()]).subscribe({
      next: ([items, categories]) => {
        this.items.set(items);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** One-click availability change (e.g. mark a dessert sold out for the day). */
  setStatus(item: ApiTeaMenuItem, status: MenuItemStatus): void {
    if (item.status === status) return;
    this.savingId.set(item.id);
    this.catalog.updateTeaItem(item.id, { status }).subscribe({
      next: (updated) => {
        this.items.update((all) => all.map((existing) => (existing.id === updated.id ? updated : existing)));
        this.savingId.set(null);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.savingId.set(null);
      },
    });
  }

  confirmDelete(item: ApiTeaMenuItem): void {
    this.catalog.deleteTeaItem(item.id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.items.update((all) => all.filter((existing) => existing.id !== item.id));
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  priceLabel(item: ApiTeaMenuItem): string {
    if (item.includedInAdmission) return 'Included';
    return item.price !== null ? `฿${item.price}` : '—';
  }
}
