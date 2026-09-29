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
    coverImageUrl: 'images/garden/ero10.webp',
    images: [
      { id: 1, artworkId: 1, imageUrl: 'images/garden/ero10.webp', altText: 'A pale sculpture of two figures in embrace, framed by tropical greenery', sortOrder: 0 },
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
    coverImageUrl: 'images/garden/ero14.webp',
    images: [
      { id: 2, artworkId: 2, imageUrl: 'images/garden/ero14.webp', altText: 'A wide garden view beneath the tree canopy, a path leading toward a distant pavilion', sortOrder: 0 },
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
    coverImageUrl: 'images/garden/ero15.webp',
    images: [
      { id: 3, artworkId: 3, imageUrl: 'images/garden/ero15.webp', altText: 'An overhead view of a sculpture reading among clipped hedges', sortOrder: 0 },
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
    coverImageUrl: 'images/garden/ero18.webp',
    images: [
      { id: 4, artworkId: 4, imageUrl: 'images/garden/ero18.webp', altText: 'A garden path curving past clipped topiary and palms', sortOrder: 0 },
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
    coverImageUrl: 'images/garden/ero17.webp',
    images: [
      { id: 5, artworkId: 5, imageUrl: 'images/garden/ero17.webp', altText: 'A sculpture reading a book beneath the tree canopy, other garden figures visible beyond', sortOrder: 0 },
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
    coverImageUrl: 'images/garden/ero8.webp',
    images: [
      { id: 6, artworkId: 6, imageUrl: 'images/garden/ero8.webp', altText: 'A lily pond terrace with red ceramic vessels and a tiled pavilion beyond', sortOrder: 0 },
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
