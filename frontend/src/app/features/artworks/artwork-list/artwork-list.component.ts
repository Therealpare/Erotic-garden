import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ArtworkCardComponent } from '../../../shared/components/artwork-card/artwork-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ArtworkService } from '../../../core/services/artwork.service';
import { ArtworkCategory } from '../../../core/models/artwork.model';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';

type ArtworkFilter = 'ALL' | ArtworkCategory | 'FEATURED';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [CommonModule, ContainerComponent, ArtworkCardComponent, EmptyStateComponent, TranslatePipe],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css',
})
export class ArtworkListComponent {
  private readonly artworkService = inject(ArtworkService);
  private readonly languageService = inject(LanguageService);

  readonly artworks = toSignal(this.artworkService.getAll(), { initialValue: [] });
  readonly activeFilter = signal<ArtworkFilter>('ALL');
  readonly filters: ArtworkFilter[] = ['ALL', 'SCULPTURE', 'GARDEN', 'FEATURED'];

  readonly filterLabel = (filter: ArtworkFilter): string => {
    const t = getDictionary(this.languageService.lang()).art.filters;
    const map: Record<ArtworkFilter, string> = {
      ALL: t.all,
      SCULPTURE: t.sculpture,
      GARDEN: t.garden,
      FEATURED: t.featured,
    };
    return map[filter];
  };

  readonly filteredArtworks = computed(() => {
    const filter = this.activeFilter();
    const all = this.artworks();
    if (filter === 'ALL') return all;
    if (filter === 'FEATURED') return all.filter((artwork) => artwork.featured);
    return all.filter((artwork) => artwork.category === filter);
  });

  setFilter(filter: ArtworkFilter): void {
    this.activeFilter.set(filter);
  }
}
