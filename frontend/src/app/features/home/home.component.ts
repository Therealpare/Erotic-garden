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
import { TranslatePipe } from '../../core/i18n/translate.pipe';

import { ArtworkService } from '../../core/services/artwork.service';
import { ReviewService } from '../../core/services/review.service';
import { SiteSettingsService } from '../../core/services/site-settings.service';
import { ArtworkCategory } from '../../core/models/artwork.model';
import { buildGoogleMapsDirectionsUrl } from '../../shared/utils/maps.util';
import { translateHoursDay, translateHoursValue } from '../../shared/utils/hours.util';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

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
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly artworkService = inject(ArtworkService);
  private readonly reviewService = inject(ReviewService);
  private readonly siteSettingsService = inject(SiteSettingsService);
  private readonly languageService = inject(LanguageService);

  readonly highlights = computed<HighlightCard[]>(() => {
    const t = getDictionary(this.languageService.lang()).home.experience;
    return [
      { title: t.card1Title, description: t.card1Desc, imageUrl: 'images/garden/ero1.webp', link: '/experience' },
      { title: t.card2Title, description: t.card2Desc, imageUrl: 'images/garden/ero3.webp', link: '/art' },
      { title: t.card3Title, description: t.card3Desc, imageUrl: 'images/garden/ero4.webp', link: '/tea-house' },
      { title: t.card4Title, description: t.card4Desc, imageUrl: 'images/garden/own.webp', link: '/about' },
    ];
  });

  readonly gardenArtImages = [
    { src: 'images/garden/ero7.webp', alt: 'Garden sculpture of two embracing figures among palms and hedges' },
    { src: 'images/garden/ero6.webp', alt: 'Sculpted planter shaped like a figure, filled with trailing petunias' },
    { src: 'images/garden/ero2.webp', alt: 'Garden pavilion covered in flowering orange vines' },
  ];

  readonly artworks = toSignal(this.artworkService.getAll(), { initialValue: [] });
  readonly activeFilter = signal<ArtworkFilter>('FEATURED');
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

  formatHoursDay(days: string): string {
    return translateHoursDay(this.languageService.lang(), days);
  }

  formatHoursValue(hours: string): string {
    return translateHoursValue(this.languageService.lang(), hours);
  }

  readonly reviews = toSignal(this.reviewService.getFeatured(), { initialValue: [] });
  readonly hasReviews = computed(() => this.reviews().length > 0);
  readonly reviewSummary = toSignal(this.reviewService.getSummary(), {
    initialValue: { averageRating: 0, totalReviews: 0 },
  });

  readonly siteSettings = toSignal(this.siteSettingsService.get(), { initialValue: undefined });
  readonly directionsUrl = computed(() => {
    const settings = this.siteSettings();
    return settings ? buildGoogleMapsDirectionsUrl(settings.latitude, settings.longitude) : '';
  });
}
