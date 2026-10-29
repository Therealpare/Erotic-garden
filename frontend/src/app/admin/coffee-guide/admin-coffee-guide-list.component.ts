import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminCatalogService } from '../../core/services/admin-catalog.service';
import { AdminCoffeeGuideEntry, CoffeeGuideStatus } from '../../core/models/coffee-guide.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';
import { apiErrorMessage } from '../admin-ui';

@Component({
  selector: 'app-admin-coffee-guide-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <h1 class="font-display text-3xl text-forest">Coffee guide</h1>
    <p class="mt-1 max-w-3xl text-sm text-stone">
      The "Roast levels" and "Processing methods" sections on /coffee. These explain roasts and processes in general — each coffee's own
      roast and process is set on the product in <a routerLink="/admin/coffee" class="text-forest underline">Coffee &amp; stock</a>.
    </p>

    <p *ngIf="error()" class="mt-6 border border-terracotta/30 bg-terracotta/5 p-3 text-sm text-terracotta" role="alert">
      {{ error() }} <button type="button" class="ml-2 underline" (click)="load()">Retry</button>
    </p>
    <p *ngIf="loading()" class="mt-6 text-sm text-stone" role="status">Loading…</p>

    <section *ngFor="let group of groups()" class="mt-8" [attr.aria-labelledby]="'guide-' + group.kind">
      <h2 [id]="'guide-' + group.kind" class="text-xs font-medium uppercase tracking-wider text-stone">{{ group.title }} · {{ group.entries.length }}</h2>
      <p *ngIf="group.entries.length === 0" class="mt-2 border border-dashed border-stone/30 bg-white px-4 py-6 text-sm text-stone">Nothing here yet.</p>
      <div *ngIf="group.entries.length > 0" class="mt-2 overflow-x-auto border border-stone/20 bg-white">
        <table class="w-full min-w-[640px] text-left text-sm">
          <thead class="border-b border-stone/20 bg-cream/60 text-xs uppercase tracking-wider text-stone">
            <tr>
              <th scope="col" class="px-4 py-2">Name</th>
              <th scope="col" class="px-4 py-2">Translations</th>
              <th scope="col" class="px-4 py-2">On the site</th>
              <th scope="col" class="px-4 py-2">Order</th>
              <th scope="col" class="px-4 py-2"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of group.entries" class="border-b border-stone/10 last:border-0">
              <td class="px-4 py-2">
                <div class="flex items-center gap-3">
                  <img *ngIf="entry.imageUrl" [src]="resolve(entry.imageUrl)" alt="" class="h-10 w-10 object-cover" loading="lazy" />
                  <div>
                    <a [routerLink]="['/admin/coffee-guide', entry.id]" class="font-medium text-forest hover:underline">{{ entry.name.en }}</a>
                    <p class="text-xs text-stone">{{ entry.name.th || '—' }} · {{ entry.name.de || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2 text-xs" [class.text-terracotta]="missingTranslations(entry)" [class.text-stone]="!missingTranslations(entry)">
                {{ missingTranslations(entry) ? 'Missing: ' + missingTranslations(entry) : 'EN · TH · DE' }}
              </td>
              <td class="px-4 py-2">
                <div class="inline-flex border border-stone/30" role="group" [attr.aria-label]="'Visibility of ' + entry.name.en">
                  <button
                    *ngFor="let status of statuses"
                    type="button"
                    class="px-2 py-1 text-xs disabled:opacity-50"
                    [ngClass]="entry.status === status ? (status === 'ACTIVE' ? 'bg-forest text-ivory' : 'bg-stone text-ivory') : 'text-charcoal hover:bg-cream'"
                    [attr.aria-pressed]="entry.status === status"
                    [disabled]="savingId() === entry.id"
                    (click)="setStatus(entry, status)"
                  >
                    {{ status === 'ACTIVE' ? 'Shown' : 'Hidden' }}
                  </button>
                </div>
              </td>
              <td class="px-4 py-2">{{ entry.sortOrder }}</td>
              <td class="px-4 py-2 text-right"><a [routerLink]="['/admin/coffee-guide', entry.id]" class="text-forest hover:underline">Edit</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class AdminCoffeeGuideListComponent {
  private readonly catalog = inject(AdminCatalogService);

  readonly resolve = resolveImageUrl;
  readonly statuses: CoffeeGuideStatus[] = ['ACTIVE', 'HIDDEN'];
  readonly entries = signal<AdminCoffeeGuideEntry[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly savingId = signal<number | null>(null);

  readonly groups = computed(() => [
    { kind: 'ROAST', title: 'Roast levels', entries: this.entries().filter((entry) => entry.kind === 'ROAST') },
    { kind: 'PROCESS', title: 'Processing methods', entries: this.entries().filter((entry) => entry.kind === 'PROCESS') },
  ]);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.catalog.coffeeGuideEntries().subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      },
    });
  }

  setStatus(entry: AdminCoffeeGuideEntry, status: CoffeeGuideStatus): void {
    if (entry.status === status) return;
    this.savingId.set(entry.id);
    this.catalog.updateCoffeeGuideEntry(entry.id, { status }).subscribe({
      next: (updated) => {
        this.entries.update((all) => all.map((existing) => (existing.id === updated.id ? updated : existing)));
        this.savingId.set(null);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.savingId.set(null);
      },
    });
  }

  /** "TH, DE" when any shown text lacks those translations (the site then falls back to English). */
  missingTranslations(entry: AdminCoffeeGuideEntry): string {
    const fields = [entry.name, entry.summary, entry.flavor, ...(entry.kind === 'ROAST' ? [entry.brewing] : [])];
    return (['th', 'de'] as const)
      .filter((lang) => fields.some((field) => field.en && !field[lang]))
      .map((lang) => lang.toUpperCase())
      .join(', ');
  }
}
