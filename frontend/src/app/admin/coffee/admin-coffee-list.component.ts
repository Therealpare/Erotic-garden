import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { AdminProduct, AdminProductVariant } from '../../core/models/product.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { ADMIN_INPUT, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-coffee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-coffee-list.component.html',
})
export class AdminCoffeeListComponent {
  private readonly catalog = inject(AdminCatalogService);
  private readonly auth = inject(AuthService);

  readonly inputClass = ADMIN_INPUT;
  readonly resolve = resolveImageUrl;

  readonly products = signal<AdminProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pendingDeleteId = signal<number | null>(null);
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');
  /** Per-size inline stock edit state. */
  readonly stockDrafts = signal<Record<number, string>>({});
  readonly stockSaving = signal<number | null>(null);
  readonly stockSaved = signal<number | null>(null);
  readonly stockErrors = signal<Record<number, string>>({});

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.catalog.products().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  draftFor(variant: AdminProductVariant): string {
    return this.stockDrafts()[variant.id] ?? String(variant.stock);
  }

  setDraft(variant: AdminProductVariant, value: string): void {
    this.stockDrafts.update((drafts) => ({ ...drafts, [variant.id]: value }));
    this.stockSaved.set(null);
  }

  saveStock(variant: AdminProductVariant): void {
    const raw = this.draftFor(variant).trim();
    const stock = Number(raw);
    if (!/^\d+$/.test(raw) || stock > 1_000_000) {
      this.stockErrors.update((errors) => ({ ...errors, [variant.id]: 'Enter a whole number, 0 or more.' }));
      return;
    }
    this.stockErrors.update(({ [variant.id]: _removed, ...rest }) => rest);
    this.stockSaving.set(variant.id);
    this.catalog.updateStock(variant.id, stock).subscribe({
      next: (updated) => {
        this.products.update((products) =>
          products.map((product) => ({
            ...product,
            variants: product.variants.map((existing) => (existing.id === updated.id ? { ...existing, stock: updated.stock } : existing)),
          })),
        );
        this.stockDrafts.update(({ [variant.id]: _removed, ...rest }) => rest);
        this.stockSaving.set(null);
        this.stockSaved.set(variant.id);
      },
      error: (error: unknown) => {
        this.stockErrors.update((errors) => ({ ...errors, [variant.id]: apiErrorMessage(error) }));
        this.stockSaving.set(null);
      },
    });
  }

  confirmDelete(product: AdminProduct): void {
    this.catalog.deleteProduct(product.id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.products.update((all) => all.filter((existing) => existing.id !== product.id));
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }
}
