import { Injectable, NotFoundException } from '@nestjs/common';
import { Artwork } from './entities/artwork.entity';

/**
 * Demo artwork content — no real artwork titles, stories, materials or dates exist yet.
 * These will be replaced by CMS-managed data once the garden's curator provides it
 * (spec §14/§48). Swap this in-memory store for a repository in Phase 5.
 */
const ARTWORKS: Artwork[] = [
  makeArtwork(
    1,
    'Untitled Study I',
    'untitled-study-i',
    'SCULPTURE',
    'Entrance Grove',
    true,
  ),
  makeArtwork(
    2,
    'Canopy Fragment',
    'canopy-fragment',
    'GARDEN',
    'Upper Terrace',
    true,
  ),
  makeArtwork(
    3,
    'Stone Vessel No. 3',
    'stone-vessel-no-3',
    'SCULPTURE',
    'Reflection Pond',
    true,
  ),
  makeArtwork(4, 'Root Line', 'root-line', 'GARDEN', 'Lower Path', false),
  makeArtwork(
    5,
    'Woven Silence',
    'woven-silence',
    'SCULPTURE',
    'Bamboo Corridor',
    false,
  ),
  makeArtwork(
    6,
    'Terrace Marker',
    'terrace-marker',
    'GARDEN',
    'Tea House Terrace',
    false,
  ),
];

function makeArtwork(
  id: number,
  title: string,
  slug: string,
  category: Artwork['category'],
  location: string,
  featured: boolean,
): Artwork {
  const now = new Date();
  return {
    id,
    title,
    slug,
    category,
    description: 'Demo content — pending curator-provided artwork details.',
    story: 'Demo content — pending curator-provided artwork story.',
    material: 'TODO: OWNER VERIFIED CONTENT REQUIRED',
    year: 'TODO',
    location,
    featured,
    status: 'PUBLISHED',
    images: [
      {
        id,
        artworkId: id,
        imageUrl: `https://picsum.photos/seed/eg-artwork-${id}/1200/1500`,
        publicId: `eg-artwork-${id}`,
        altText: `Demo artwork placeholder for ${title}`,
        sortOrder: 0,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

@Injectable()
export class ArtworksService {
  findAll(): Artwork[] {
    return ARTWORKS.filter((artwork) => artwork.status === 'PUBLISHED');
  }

  findFeatured(): Artwork[] {
    return this.findAll().filter((artwork) => artwork.featured);
  }

  findBySlug(slug: string): Artwork {
    const artwork = ARTWORKS.find(
      (a) => a.slug === slug && a.status === 'PUBLISHED',
    );
    if (!artwork) {
      throw new NotFoundException(`Artwork with slug "${slug}" not found`);
    }
    return artwork;
  }
}
