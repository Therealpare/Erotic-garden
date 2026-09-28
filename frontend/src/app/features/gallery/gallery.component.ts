import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { GalleryGridComponent } from '../../shared/components/gallery-grid/gallery-grid.component';
import { GalleryLightboxComponent } from '../../shared/components/gallery-lightbox/gallery-lightbox.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryCategorySlug } from '../../core/models/gallery.model';

type CategoryFilter = 'ALL' | GalleryCategorySlug;

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, ContainerComponent, GalleryGridComponent, GalleryLightboxComponent, EmptyStateComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent {
  private readonly galleryService = inject(GalleryService);

  readonly categories = toSignal(this.galleryService.getCategories(), { initialValue: [] });
  readonly images = toSignal(this.galleryService.getAll(), { initialValue: [] });

  readonly activeCategory = signal<CategoryFilter>('ALL');
  readonly activeIndex = signal<number | null>(null);

  readonly filters = computed<CategoryFilter[]>(() => ['ALL', ...this.categories().map((c) => c.slug)]);

  readonly filteredImages = computed(() => {
    const category = this.activeCategory();
    const all = this.images();
    return category === 'ALL' ? all : all.filter((image) => image.categorySlug === category);
  });

  setCategory(category: CategoryFilter): void {
    this.activeCategory.set(category);
    this.activeIndex.set(null);
  }

  openLightbox(index: number): void {
    this.activeIndex.set(index);
  }

  closeLightbox(): void {
    this.activeIndex.set(null);
  }

  categoryLabel(slug: CategoryFilter): string {
    if (slug === 'ALL') return 'All';
    return this.categories().find((c) => c.slug === slug)?.name ?? slug;
  }
}
