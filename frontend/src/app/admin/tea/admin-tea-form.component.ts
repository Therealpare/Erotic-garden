import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { ApiTeaCategory, MENU_ITEM_STATUSES, MenuItemStatus } from '../../core/models/tea-menu.model';
import { ImageUploadFieldComponent } from '../shared/image-upload-field.component';
import { LocalizedFieldsComponent } from '../shared/localized-fields.component';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';
import { MENU_STATUS_LABEL } from './admin-tea-list.component';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugify(text: string): string {
  return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

@Component({
  selector: 'app-admin-tea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUploadFieldComponent, LocalizedFieldsComponent],
  templateUrl: './admin-tea-form.component.html',
})
export class AdminTeaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalog = inject(AdminCatalogService);
  private readonly router = inject(Router);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly statuses = MENU_ITEM_STATUSES;
  readonly statusLabel = MENU_STATUS_LABEL;
  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || null;

  readonly categories = signal<ApiTeaCategory[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly imageUrl = signal('');

  readonly form = this.fb.nonNullable.group({
    categoryId: [0, [Validators.required, Validators.min(1)]],
    slug: ['', [Validators.required, Validators.pattern(SLUG), Validators.maxLength(80)]],
    name: this.fb.nonNullable.group({
      en: ['', [Validators.required, Validators.maxLength(160)]],
      th: ['', [Validators.maxLength(160)]],
      de: ['', [Validators.maxLength(160)]],
    }),
    description: this.fb.nonNullable.group({
      en: ['', [Validators.maxLength(2000)]],
      th: ['', [Validators.maxLength(2000)]],
      de: ['', [Validators.maxLength(2000)]],
    }),
    includedInAdmission: [false],
    price: ['' as string | number, [Validators.min(0), Validators.max(1000000)]],
    status: ['AVAILABLE' as MenuItemStatus],
    sortOrder: [0, [Validators.min(0), Validators.max(100000)]],
  });

  constructor() {
    this.catalog.teaCategories().subscribe({
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
      this.catalog.teaItem(this.id).subscribe({
        next: (item) => {
          this.form.patchValue({
            categoryId: item.categoryId,
            slug: item.slug,
            name: { en: item.name.en, th: item.name.th ?? '', de: item.name.de ?? '' },
            description: { en: item.description.en ?? '', th: item.description.th ?? '', de: item.description.de ?? '' },
            includedInAdmission: item.includedInAdmission,
            price: item.price ?? '',
            status: item.status,
            sortOrder: item.sortOrder,
          });
          this.imageUrl.set(item.imageUrl ?? '');
          this.loading.set(false);
        },
        error: (error: unknown) => this.fail(error),
      });
    } else {
      // Suggest a slug from the English name for new items until the admin edits it.
      this.form.controls.name.controls.en.valueChanges.subscribe((name) => {
        if (!this.form.controls.slug.dirty) this.form.controls.slug.setValue(slugify(name));
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const price = value.includedInAdmission || value.price === '' ? null : Number(value.price);
    const input = {
      ...value,
      categoryId: Number(value.categoryId),
      sortOrder: Number(value.sortOrder) || 0,
      price,
      imageUrl: this.imageUrl() || null,
    };
    this.saving.set(true);
    this.error.set(null);
    (this.id === null ? this.catalog.createTeaItem(input) : this.catalog.updateTeaItem(this.id, input)).subscribe({
      next: () => void this.router.navigate(['/admin/tea']),
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  invalid(name: 'slug' | 'price' | 'sortOrder'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  private fail(error: unknown): void {
    this.error.set(apiErrorMessage(error));
    this.loading.set(false);
  }
}
