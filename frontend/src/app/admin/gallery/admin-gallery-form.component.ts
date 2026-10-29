import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { GalleryCategory } from '../../core/models/gallery.model';
import { ImageUploadFieldComponent } from '../shared/image-upload-field.component';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-gallery-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUploadFieldComponent],
  templateUrl: './admin-gallery-form.component.html',
})
export class AdminGalleryFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalog = inject(AdminCatalogService);
  private readonly router = inject(Router);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || null;

  readonly categories = signal<GalleryCategory[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly imageUrl = signal('');
  readonly imageMissing = signal(false);

  readonly form = this.fb.nonNullable.group({
    categoryId: [0, [Validators.required, Validators.min(1)]],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
    altText: ['', [Validators.required, Validators.maxLength(300)]],
    featured: [false],
    isPublished: [true],
    sortOrder: [0, [Validators.min(0), Validators.max(100000)]],
  });

  constructor() {
    this.catalog.galleryCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        if (this.id === null) {
          this.form.patchValue({ categoryId: categories[0]?.id ?? 0 });
          this.loading.set(false);
        }
      },
      error: (error: unknown) => this.fail(error),
    });
    if (this.id !== null) {
      this.catalog.galleryImage(this.id).subscribe({
        next: (image) => {
          this.form.patchValue(image);
          this.imageUrl.set(image.imageUrl);
          this.loading.set(false);
        },
        error: (error: unknown) => this.fail(error),
      });
    }
  }

  save(): void {
    this.imageMissing.set(!this.imageUrl());
    if (this.form.invalid || !this.imageUrl()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const input = { ...value, categoryId: Number(value.categoryId), sortOrder: Number(value.sortOrder) || 0, imageUrl: this.imageUrl() };
    this.saving.set(true);
    this.error.set(null);
    (this.id === null ? this.catalog.createGalleryImage(input) : this.catalog.updateGalleryImage(this.id, input)).subscribe({
      next: () => void this.router.navigate(['/admin/gallery']),
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  private fail(error: unknown): void {
    this.error.set(apiErrorMessage(error));
    this.loading.set(false);
  }
}
