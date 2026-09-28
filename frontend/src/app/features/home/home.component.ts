import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ExperienceCardComponent } from '../../shared/components/experience-card/experience-card.component';
import { ArtworkCardComponent } from '../../shared/components/artwork-card/artwork-card.component';
import { ReviewCardComponent } from '../../shared/components/review-card/review-card.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { MapComponent } from '../../shared/components/map/map.component';

import { ArtworkService } from '../../core/services/artwork.service';
import { ReviewService } from '../../core/services/review.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { ArtworkCategory } from '../../core/models/artwork.model';
import { buildGoogleMapsDirectionsUrl } from '../../shared/utils/maps.util';

type ArtworkFilter = 'ALL' | ArtworkCategory | 'FEATURED';

interface HighlightCard {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContainerComponent,
    SectionHeaderComponent,
    ButtonComponent,
    ExperienceCardComponent,
    ArtworkCardComponent,
    ReviewCardComponent,
    ImageRevealComponent,
    EmptyStateComponent,
    MapComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly artworkService = inject(ArtworkService);
  private readonly reviewService = inject(ReviewService);
  private readonly siteSettingsService = inject(SiteSettingsService);

  readonly highlights: HighlightCard[] = [
    {
      title: 'Explore the Garden',
      description: 'Wander tropical planting, quiet paths and shaded terraces.',
      imageUrl: 'https://picsum.photos/seed/eg-highlight-garden/900/1200',
      link: '/experience',
    },
    {
      title: 'Discover the Art',
      description: 'Contemporary sculpture and installations set between the trees.',
      imageUrl: 'https://picsum.photos/seed/eg-highlight-art/900/1200',
      link: '/art',
    },
    {
      title: 'Tea House',
      description: 'Tea, coffee and homemade treats in a slow, unhurried setting.',
      imageUrl: 'https://picsum.photos/seed/eg-highlight-tea/900/1200',
      link: '/tea-house',
    },
    {
      title: 'Stories with Katai',
      description: 'The person behind the garden, and the story of how it grew.',
      imageUrl: 'https://picsum.photos/seed/eg-highlight-katai/900/1200',
      link: '/about',
    },
  ];

  readonly gardenArtImages = [
    { src: 'https://picsum.photos/seed/eg-garden-art-main/1400/1750', alt: 'Demo sculpture set among tall trees' },
    { src: 'https://picsum.photos/seed/eg-garden-art-2/900/1100', alt: 'Demo detail of an installation' },
    { src: 'https://picsum.photos/seed/eg-garden-art-3/900/1100', alt: 'Demo garden path at dusk' },
  ];

  readonly artworks = toSignal(this.artworkService.getAll(), { initialValue: [] });
  readonly activeFilter = signal<ArtworkFilter>('FEATURED');
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

  readonly reviews = toSignal(this.reviewService.getFeatured(), { initialValue: [] });
  readonly hasReviews = computed(() => this.reviews().length > 0);
  readonly reviewSummary = toSignal(this.reviewService.getSummary(), {
    initialValue: { averageRating: 0, totalReviews: 0 },
  });

  readonly siteSettings = toSignal(this.siteSettingsService.get(), { initialValue: undefined });
  readonly directionsUrl = computed(() => buildGoogleMapsDirectionsUrl(this.siteSettings()?.address ?? ''));
}
