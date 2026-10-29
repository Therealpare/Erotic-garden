import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { AdminProductVariant, ProductImage, ProductInput, ProductStatus, VariantStatus } from '../../core/models/product.model';
import { ImageUploadFieldComponent } from '../shared/image-upload-field.component';
import { LocalizedFieldsComponent } from '../shared/localized-fields.component';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';
import { resolveImageUrl } from '../../shared/utils/image-url.util';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Size labels must be unique within one product (case-insensitive), matching the API rule. */
function distinctLabels(control: AbstractControl): ValidationErrors | null {
  const labels = (control as FormArray).controls.map((group) => String(group.get('label')?.value ?? '').trim().toLowerCase());
  const filled = labels.filter(Boolean);
  return new Set(filled).size === filled.length ? null : { duplicateLabels: true };
}

@Component({
  selector: 'app-admin-coffee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUploadFieldComponent, LocalizedFieldsComponent],
  templateUrl: './admin-coffee-form.component.html',
})
export class AdminCoffeeFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalog = inject(AdminCatalogService);
  private readonly router = inject(Router);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly resolve = resolveImageUrl;
  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || null;

  readonly loading = signal(this.id !== null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  /** Photos, in display order (first = main shop photo). */
  readonly images = signal<ProductImage[]>([]);
  readonly newImageUrl = signal('');
  readonly newImageAlt = signal('');
  readonly imageError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
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
    origin: ['', [Validators.maxLength(160)]],
    process: ['', [Validators.maxLength(160)]],
    roastLevel: ['', [Validators.maxLength(80)]],
    tastingNotes: ['', [Validators.maxLength(300)]],
    status: ['ACTIVE' as ProductStatus],
    sortOrder: [0, [Validators.min(0)]],
    variants: this.fb.array([] as ReturnType<AdminCoffeeFormComponent['variantGroup']>[], { validators: distinctLabels }),
  });

  get variants(): FormArray {
    return this.form.controls.variants;
  }

  constructor() {
    if (this.id !== null) {
      this.catalog.product(this.id).subscribe({
        next: (product) => {
          this.form.patchValue({
            slug: product.slug,
            name: { en: product.name.en, th: product.name.th ?? '', de: product.name.de ?? '' },
            description: { en: product.description.en ?? '', th: product.description.th ?? '', de: product.description.de ?? '' },
            origin: product.origin ?? '',
            process: product.process ?? '',
            roastLevel: product.roastLevel ?? '',
            tastingNotes: product.tastingNotes ?? '',
            status: product.status,
            sortOrder: product.sortOrder,
          });
          product.variants.forEach((variant) => this.variants.push(this.variantGroup(variant)));
          this.images.set(product.images.map(({ imageUrl, altText, sortOrder }) => ({ imageUrl, altText, sortOrder })));
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
      });
    }
  }

  variantGroup(variant?: Partial<AdminProductVariant>) {
    return this.fb.nonNullable.group({
      id: [variant?.id ?? (null as number | null)],
      label: [variant?.label ?? '', [Validators.required, Validators.maxLength(40)]],
      sku: [variant?.sku ?? '', [Validators.pattern(/^[A-Za-z0-9._-]{0,60}$/)]],
      // Blank for new sizes on purpose: prices are only what the owner enters.
      price: [variant?.price ?? ('' as number | ''), [Validators.required, Validators.min(0), Validators.max(1000000)]],
      stock: [variant?.stock ?? 0, [Validators.required, Validators.min(0), Validators.max(1000000), Validators.pattern(/^\d+$/)]],
      status: [(variant?.status ?? 'ACTIVE') as VariantStatus],
    });
  }

  addVariant(): void {
    this.variants.push(this.variantGroup());
  }

  removeVariant(index: number): void {
    this.variants.removeAt(index);
  }

  addImage(): void {
    if (!this.newImageUrl()) return this.imageError.set('Upload a photo or paste a URL first.');
    if (!this.newImageAlt().trim()) return this.imageError.set('Describe the photo (alt text) for accessibility.');
    this.images.update((images) => [...images, { imageUrl: this.newImageUrl(), altText: this.newImageAlt().trim(), sortOrder: images.length }]);
    this.newImageUrl.set('');
    this.newImageAlt.set('');
    this.imageError.set(null);
  }

  moveImage(index: number, direction: -1 | 1): void {
    this.images.update((images) => {
      const next = [...images];
      const target = index + direction;
      if (target < 0 || target >= next.length) return images;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  removeImage(index: number): void {
    this.images.update((images) => images.filter((_, position) => position !== index));
  }

  setImageAlt(index: number, altText: string): void {
    this.images.update((images) => images.map((image, position) => (position === index ? { ...image, altText } : image)));
  }

  save(): void {
    if (this.form.invalid || this.images().some((image) => !image.altText.trim())) {
      this.form.markAllAsTouched();
      if (this.images().some((image) => !image.altText.trim())) this.imageError.set('Every photo needs alt text.');
      return;
    }
    const value = this.form.getRawValue();
    const input: ProductInput = {
      slug: value.slug,
      name: value.name,
      description: value.description,
      origin: value.origin.trim() || null,
      process: value.process.trim() || null,
      roastLevel: value.roastLevel.trim() || null,
      tastingNotes: value.tastingNotes.trim() || null,
      status: value.status,
      sortOrder: Number(value.sortOrder) || 0,
      images: this.images().map((image, index) => ({ ...image, sortOrder: index })),
      variants: value.variants.map((variant, index) => ({
        ...(variant.id ? { id: variant.id } : {}),
        label: variant.label.trim(),
        sku: variant.sku.trim() || null,
        price: Number(variant.price),
        currency: 'THB',
        stock: Number(variant.stock),
        status: variant.status,
        sortOrder: index,
      })),
    };
    this.saving.set(true);
    this.error.set(null);
    (this.id === null ? this.catalog.createProduct(input) : this.catalog.updateProduct(this.id, input)).subscribe({
      next: () => void this.router.navigate(['/admin/coffee']),
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(apiErrorMessage(error));
      },
    });
  }

  invalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }
}
