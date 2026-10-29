import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { AdminGalleryImage, GalleryCategory } from '../../core/models/gallery.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-gallery-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-gallery-list.component.html',
})
export class AdminGalleryListComponent {
  private readonly catalog = inject(AdminCatalogService);
  private readonly auth = inject(AuthService);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly resolve = resolveImageUrl;

  readonly images = signal<AdminGalleryImage[]>([]);
  readonly categories = signal<GalleryCategory[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly pendingDeleteId = signal<number | null>(null);
  readonly canDelete = computed(() => this.auth.user()?.role === 'ADMIN');

  readonly categoryFilter = signal<number | ''>('');
  readonly visibilityFilter = signal<'' | 'published' | 'hidden'>('');

  readonly visible = computed(() =>
    this.images().filter(
      (image) =>
        (this.categoryFilter() === '' || image.categoryId === this.categoryFilter()) &&
        (this.visibilityFilter() === '' || image.isPublished === (this.visibilityFilter() === 'published')),
    ),
  );

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin([this.catalog.galleryImages(), this.catalog.galleryCategories()]).subscribe({
      next: ([images, categories]) => {
        this.images.set(images);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  togglePublished(image: AdminGalleryImage): void {
    this.catalog.updateGalleryImage(image.id, { isPublished: !image.isPublished }).subscribe({
      next: (updated) => this.images.update((all) => all.map((item) => (item.id === updated.id ? updated : item))),
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }

  confirmDelete(image: AdminGalleryImage): void {
    this.catalog.deleteGalleryImage(image.id).subscribe({
      next: () => {
        this.pendingDeleteId.set(null);
        this.images.update((all) => all.filter((item) => item.id !== image.id));
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error)),
    });
  }
}
