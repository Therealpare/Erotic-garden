import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Artwork } from '../models/artwork.model';

/**
 * Demo artwork content. No real artwork titles, stories, materials or dates exist yet —
 * these will be replaced by CMS-managed data once the garden's curator provides it (see spec §14, §48).
 * Method names mirror the future GET /api/v1/artworks endpoints so swapping in HttpClient later is a drop-in change.
 */
const DEMO_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: 'Untitled Study I',
    slug: 'untitled-study-i',
    category: 'SCULPTURE',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Entrance Grove',
    featured: true,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-1/1200/1500',
    images: [
      { id: 1, artworkId: 1, imageUrl: 'https://picsum.photos/seed/eg-artwork-1/1200/1500', altText: 'Demo sculpture placed among tropical foliage', sortOrder: 0 },
    ],
  },
  {
    id: 2,
    title: 'Canopy Fragment',
    slug: 'canopy-fragment',
    category: 'GARDEN',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Upper Terrace',
    featured: true,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-2/1200/1500',
    images: [
      { id: 2, artworkId: 2, imageUrl: 'https://picsum.photos/seed/eg-artwork-2/1200/1500', altText: 'Demo installation suspended beneath the tree canopy', sortOrder: 0 },
    ],
  },
  {
    id: 3,
    title: 'Stone Vessel No. 3',
    slug: 'stone-vessel-no-3',
    category: 'SCULPTURE',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Reflection Pond',
    featured: true,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-3/1200/1500',
    images: [
      { id: 3, artworkId: 3, imageUrl: 'https://picsum.photos/seed/eg-artwork-3/1200/1500', altText: 'Demo carved stone form beside still water', sortOrder: 0 },
    ],
  },
  {
    id: 4,
    title: 'Root Line',
    slug: 'root-line',
    category: 'GARDEN',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Lower Path',
    featured: false,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-4/1200/1500',
    images: [
      { id: 4, artworkId: 4, imageUrl: 'https://picsum.photos/seed/eg-artwork-4/1200/1500', altText: 'Demo woven form following an exposed root line', sortOrder: 0 },
    ],
  },
  {
    id: 5,
    title: 'Woven Silence',
    slug: 'woven-silence',
    category: 'SCULPTURE',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Bamboo Corridor',
    featured: false,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-5/1200/1500',
    images: [
      { id: 5, artworkId: 5, imageUrl: 'https://picsum.photos/seed/eg-artwork-5/1200/1500', altText: 'Demo woven installation inside a bamboo corridor', sortOrder: 0 },
    ],
  },
  {
    id: 6,
    title: 'Terrace Marker',
    slug: 'terrace-marker',
    category: 'GARDEN',
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: '',
    year: '',
    location: 'Tea House Terrace',
    featured: false,
    status: 'PUBLISHED',
    coverImageUrl: 'https://picsum.photos/seed/eg-artwork-6/1200/1500',
    images: [
      { id: 6, artworkId: 6, imageUrl: 'https://picsum.photos/seed/eg-artwork-6/1200/1500', altText: 'Demo marker sculpture on the tea house terrace', sortOrder: 0 },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class ArtworkService {
  getAll(): Observable<Artwork[]> {
    return of(DEMO_ARTWORKS);
  }

  getFeatured(): Observable<Artwork[]> {
    return of(DEMO_ARTWORKS.filter((artwork) => artwork.featured));
  }

  getBySlug(slug: string): Observable<Artwork | undefined> {
    return of(DEMO_ARTWORKS.find((artwork) => artwork.slug === slug));
  }

  getAdjacent(slug: string): Observable<{ previous?: Artwork; next?: Artwork }> {
    const index = DEMO_ARTWORKS.findIndex((artwork) => artwork.slug === slug);
    return of({
      previous: index > 0 ? DEMO_ARTWORKS[index - 1] : undefined,
      next: index >= 0 && index < DEMO_ARTWORKS.length - 1 ? DEMO_ARTWORKS[index + 1] : undefined,
    });
  }

  getRelated(slug: string, limit = 3): Observable<Artwork[]> {
    return of(DEMO_ARTWORKS.filter((artwork) => artwork.slug !== slug).slice(0, limit));
  }
}
