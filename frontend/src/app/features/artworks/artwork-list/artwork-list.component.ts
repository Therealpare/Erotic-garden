import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ArtworkCardComponent } from '../../../shared/components/artwork-card/artwork-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ArtworkService } from '../../../core/services/artwork.service';
import { ArtworkCategory } from '../../../core/models/artwork.model';

type ArtworkFilter = 'ALL' | ArtworkCategory | 'FEATURED';

@Component({
  selector: 'app-artwork-list',
  standalone: true,
  imports: [CommonModule, ContainerComponent, ArtworkCardComponent, EmptyStateComponent],
  templateUrl: './artwork-list.component.html',
  styleUrl: './artwork-list.component.css',
})
export class ArtworkListComponent {
  private readonly artworkService = inject(ArtworkService);

  readonly artworks = toSignal(this.artworkService.getAll(), { initialValue: [] });
  readonly activeFilter = signal<ArtworkFilter>('ALL');
  readonly filters: ArtworkFilter[] = ['ALL', 'SCULPTURE', 'GARDEN', 'FEATURED'];

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
