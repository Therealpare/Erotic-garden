import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AdminMediaService } from '../../core/services/admin-media.service';
import { MEDIA_TYPES, MediaItemInput, MediaStatus, MediaType } from '../../core/models/media.model';
import { youtubeThumbnailUrl } from '../../shared/utils/youtube.util';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';

const HTTPS_URL = /^https:\/\/\S+$/i;
const YOUTUBE_ID = /(?:youtu\.be\/|[?&]v=|\/(?:shorts|embed|live)\/)([A-Za-z0-9_-]{11})/;

@Component({
  selector: 'app-admin-media-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-media-form.component.html',
})
export class AdminMediaFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly mediaService = inject(AdminMediaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly types = MEDIA_TYPES;

  readonly id = Number(this.route.snapshot.paramMap.get('id')) || null;
  readonly loading = signal(this.id !== null);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    type: ['VIDEO' as MediaType, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(200)]],
    source: ['', [Validators.required, Validators.maxLength(120)]],
    url: ['', [Validators.required, Validators.pattern(HTTPS_URL), Validators.maxLength(500)]],
    thumbnailUrl: ['', [Validators.pattern(HTTPS_URL), Validators.maxLength(500)]],
    summary: ['', [Validators.maxLength(1000)]],
    publishedAt: [''],
    isFeatured: [false],
    status: ['DRAFT' as MediaStatus],
    sortOrder: [0, [Validators.min(0), Validators.max(10000)]],
  });

  private readonly url = toSignal(this.form.controls.url.valueChanges, { initialValue: '' });
  /** Live preview of what the site will detect, mirroring the server-side parsing. */
  readonly detectedYoutubeId = computed(() => this.url().match(YOUTUBE_ID)?.[1] ?? null);
  readonly previewThumbnail = computed(() => {
    const id = this.detectedYoutubeId();
    return id ? youtubeThumbnailUrl(id) : null;
  });

  constructor() {
    if (this.id !== null) {
      this.mediaService.get(this.id).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
            thumbnailUrl: item.thumbnailUrl ?? '',
            summary: item.summary ?? '',
            publishedAt: item.publishedAt ?? '',
          });
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error));
          this.loading.set(false);
        },
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const input: MediaItemInput = {
      ...value,
      title: value.title.trim(),
      source: value.source.trim(),
      url: value.url.trim(),
      thumbnailUrl: value.thumbnailUrl.trim() || null,
      summary: value.summary.trim() || null,
      publishedAt: value.publishedAt || null,
      sortOrder: Number(value.sortOrder) || 0,
    };

    this.saving.set(true);
    this.error.set(null);
    const request = this.id === null ? this.mediaService.create(input) : this.mediaService.update(this.id, input);
    request.subscribe({
      next: () => void this.router.navigate(['/admin/media']),
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
}
