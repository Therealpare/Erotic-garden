import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ArtworkCardComponent } from '../../../shared/components/artwork-card/artwork-card.component';
import { ArtworkService } from '../../../core/services/artwork.service';
import { Artwork } from '../../../core/models/artwork.model';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, ArtworkCardComponent, TranslatePipe],
  templateUrl: './artwork-detail.component.html',
  styleUrl: './artwork-detail.component.css',
})
export class ArtworkDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly artworkService = inject(ArtworkService);
  private readonly languageService = inject(LanguageService);

  private readonly slug$ = this.route.paramMap.pipe(
    switchMap((params) => of(params.get('slug') ?? '')),
  );

  readonly artwork = toSignal(
    this.slug$.pipe(switchMap((slug) => this.artworkService.getBySlug(slug))),
    { initialValue: undefined },
  );

  readonly adjacent = toSignal(
    this.slug$.pipe(switchMap((slug) => this.artworkService.getAdjacent(slug))),
    { initialValue: { previous: undefined, next: undefined } as { previous?: Artwork; next?: Artwork } },
  );

  readonly related = toSignal(
    this.slug$.pipe(switchMap((slug) => this.artworkService.getRelated(slug))),
    { initialValue: [] },
  );

  categoryLabel(category: Artwork['category']): string {
    const t = getDictionary(this.languageService.lang()).art.filters;
    return category === 'SCULPTURE' ? t.sculpture : t.garden;
  }
}
