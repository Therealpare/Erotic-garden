import { Component, computed, inject, input, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { ADMIN_INPUT, apiErrorMessage } from '../admin-ui';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Image picker for admin forms: upload a file (stored by the API) or paste a URL, with a
 * live preview. Two-way binds the stored URL (`[(url)]`).
 */
@Component({
  selector: 'app-image-upload-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap items-start gap-4">
      <div class="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden border border-stone/20 bg-cream/40">
        <img *ngIf="preview() as src; else noImage" [src]="src" alt="Selected image preview" class="h-full w-full object-cover" />
        <ng-template #noImage><span class="px-2 text-center text-xs text-stone">No image</span></ng-template>
      </div>
      <div class="min-w-0 flex-1 space-y-2">
        <label class="inline-flex cursor-pointer items-center border border-forest px-3 py-1.5 text-sm text-forest hover:bg-forest hover:text-ivory focus-within:outline focus-within:outline-2 focus-within:outline-terracotta">
          <input type="file" class="sr-only" [attr.id]="inputId()" accept="image/jpeg,image/png,image/webp,image/avif" (change)="onFile($event)" [disabled]="uploading()" />
          {{ uploading() ? 'Uploading…' : url() ? 'Replace image…' : 'Upload image…' }}
        </label>
        <button *ngIf="url() && allowClear()" type="button" (click)="url.set('')" class="ml-3 text-sm text-terracotta hover:underline">Remove</button>
        <p class="text-xs text-stone">JPEG, PNG, WebP or AVIF, up to 8 MB.</p>
        <input
          type="text"
          [class]="inputClass"
          [value]="url()"
          (change)="url.set($any($event.target).value.trim())"
          placeholder="…or paste an https:// image URL"
          [attr.aria-label]="label() + ' URL'"
        />
        <p *ngIf="error()" class="text-xs text-terracotta" role="alert">{{ error() }}</p>
      </div>
    </div>
  `,
})
export class ImageUploadFieldComponent {
  private readonly catalog = inject(AdminCatalogService);

  url = model('');
  label = input('Image');
  inputId = input<string | null>(null);
  allowClear = input(false);

  readonly inputClass = ADMIN_INPUT;
  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);
  readonly preview = computed(() => resolveImageUrl(this.url()));

  onFile(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files?.[0];
    element.value = '';
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return this.error.set('Please choose a JPEG, PNG, WebP or AVIF image.');
    if (file.size > MAX_BYTES) return this.error.set('That image is larger than 8 MB.');

    this.error.set(null);
    this.uploading.set(true);
    this.catalog.uploadImage(file).subscribe({
      next: (result) => {
        this.url.set(result.url);
        this.uploading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error, 'Upload failed.'));
        this.uploading.set(false);
      },
    });
  }
}
