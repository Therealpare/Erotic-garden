import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

import { ContainerComponent } from '../../../shared/components/container/container.component';
import { ArtworkCardComponent } from '../../../shared/components/artwork-card/artwork-card.component';
import { ArtworkService } from '../../../core/services/artwork.service';
import { Artwork } from '../../../core/models/artwork.model';

@Component({
  selector: 'app-artwork-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, ArtworkCardComponent],
  templateUrl: './artwork-detail.component.html',
  styleUrl: './artwork-detail.component.css',
})
export class ArtworkDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly artworkService = inject(ArtworkService);

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
}
