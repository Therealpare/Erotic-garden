import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { CoffeeGuideKind, CoffeeGuideStatus } from '../../core/models/coffee-guide.model';
import { LocalizedText } from '../../core/models/localized-text.model';
import { ImageUploadFieldComponent } from '../shared/image-upload-field.component';
import { LocalizedFieldsComponent } from '../shared/localized-fields.component';
import { ADMIN_INPUT, ADMIN_LABEL, apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-coffee-guide-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ImageUploadFieldComponent, LocalizedFieldsComponent],
  template: `
    <a routerLink="/admin/coffee-guide" class="text-sm text-forest hover:underline">← Back to coffee guide</a>
    <h1 class="mt-4 font-display text-3xl text-forest">Edit {{ kind() === 'ROAST' ? 'roast level' : 'processing method' }}</h1>
    <p *ngIf="key()" class="mt-1 text-xs text-stone">
      Key: <code>{{ key() }}</code> — fixed, used to link coffees whose label says this {{ kind() === 'ROAST' ? 'roast' : 'process' }}.
    </p>

    <p *ngIf="loading()" class="mt-6 text-sm text-stone" role="status">Loading…</p>
    <p *ngIf="error() && loading()" class="mt-6 text-sm text-terracotta" role="alert">{{ error() }}</p>

    <form *ngIf="!loading()" [formGroup]="form" (ngSubmit)="save()" novalidate class="mt-6 grid max-w-4xl grid-cols-1 gap-5 border border-stone/20 bg-white p-6 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <app-localized-fields [group]="form.controls.name" label="Name" idPrefix="guide-name" [requiredEn]="true"></app-localized-fields>
      </div>
      <div class="sm:col-span-2">
        <app-localized-fields
          [group]="form.controls.summary"
          [label]="kind() === 'ROAST' ? 'The beans (appearance)' : 'How it’s done'"
          idPrefix="guide-summary"
          [multiline]="true"
        ></app-localized-fields>
      </div>
      <div class="sm:col-span-2">
        <app-localized-fields [group]="form.controls.flavor" label="In the cup (typical flavour)" idPrefix="guide-flavor" [multiline]="true"></app-localized-fields>
      </div>
      <div *ngIf="kind() === 'ROAST'" class="sm:col-span-2">
        <app-localized-fields [group]="form.controls.brewing" label="Best for (brewing methods)" idPrefix="guide-brewing" [multiline]="true"></app-localized-fields>
      </div>

      <div class="sm:col-span-2">
        <p [class]="labelClass">Picture (optional)</p>
        <app-image-upload-field [(url)]="imageUrl" label="Guide picture" inputId="guide-image" [allowClear]="true"></app-image-upload-field>
        <p class="mt-2 text-xs text-stone">Without a picture the site shows a simple illustration. Use real photos only.</p>
      </div>
      <div class="sm:col-span-2" *ngIf="imageUrl()">
        <label for="guide-alt" [class]="labelClass">Picture description (for screen readers)</label>
        <input id="guide-alt" type="text" formControlName="imageAlt" [class]="inputClass" maxlength="300" />
      </div>

      <div>
        <label for="guide-status" [class]="labelClass">On the site</label>
        <select id="guide-status" formControlName="status" [class]="inputClass">
          <option value="ACTIVE">Shown</option>
          <option value="HIDDEN">Hidden</option>
        </select>
      </div>
      <div>
        <label for="guide-order" [class]="labelClass">Display order</label>
        <input id="guide-order" type="number" min="0" formControlName="sortOrder" [class]="inputClass" />
      </div>

      <p *ngIf="error() && !loading()" class="text-sm text-terracotta sm:col-span-2" role="alert">{{ error() }}</p>

      <div class="flex gap-3 sm:col-span-2">
        <button type="submit" [disabled]="saving()" class="bg-forest px-5 py-2 text-sm text-ivory hover:bg-charcoal disabled:opacity-50">{{ saving() ? 'Saving…' : 'Save' }}</button>
        <a routerLink="/admin/coffee-guide" class="border border-stone/30 px-5 py-2 text-sm hover:bg-cream">Cancel</a>
      </div>
    </form>
  `,
})
export class AdminCoffeeGuideFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalog = inject(AdminCatalogService);
  private readonly router = inject(Router);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));

  readonly kind = signal<CoffeeGuideKind | null>(null);
  readonly key = signal('');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly imageUrl = signal('');

  readonly form = this.fb.nonNullable.group({
    name: this.localizedGroup(160, true),
    summary: this.localizedGroup(2000),
    flavor: this.localizedGroup(2000),
    brewing: this.localizedGroup(2000),
    imageAlt: ['', [Validators.maxLength(300)]],
    status: ['ACTIVE' as CoffeeGuideStatus],
    sortOrder: [0, [Validators.min(0), Validators.max(100000)]],
  });

  constructor() {
    this.catalog.coffeeGuideEntry(this.id).subscribe({
      next: (entry) => {
        const text = (value: Partial<LocalizedText>) => ({ en: value.en ?? '', th: value.th ?? '', de: value.de ?? '' });
        this.form.patchValue({
          name: text(entry.name),
          summary: text(entry.summary),
          flavor: text(entry.flavor),
          brewing: text(entry.brewing),
          imageAlt: entry.imageAlt ?? '',
          status: entry.status,
          sortOrder: entry.sortOrder,
        });
        this.kind.set(entry.kind);
        this.key.set(entry.key);
        this.imageUrl.set(entry.imageUrl ?? '');
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const imageUrl = this.imageUrl() || null;
    this.saving.set(true);
    this.error.set(null);
    this.catalog
      .updateCoffeeGuideEntry(this.id, {
        name: value.name,
        summary: value.summary,
        flavor: value.flavor,
        brewing: this.kind() === 'ROAST' ? value.brewing : undefined,
        imageUrl,
        imageAlt: imageUrl ? value.imageAlt.trim() || null : null,
        status: value.status,
        sortOrder: Number(value.sortOrder) || 0,
      })
      .subscribe({
        next: () => void this.router.navigate(['/admin/coffee-guide']),
        error: (error: unknown) => {
          this.saving.set(false);
          this.error.set(apiErrorMessage(error));
        },
      });
  }

  private localizedGroup(max: number, requireEn = false) {
    return this.fb.nonNullable.group({
      en: ['', requireEn ? [Validators.required, Validators.maxLength(max)] : [Validators.maxLength(max)]],
      th: ['', [Validators.maxLength(max)]],
      de: ['', [Validators.maxLength(max)]],
    });
  }
}
