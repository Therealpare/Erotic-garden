import { Injectable, NotFoundException } from '@nestjs/common';
import { Experience } from './entities/experience.entity';

/** Demo bookable experiences (spec §24). Duration/price are placeholders pending owner-verified content (§48). */
function makeExperience(
  id: number,
  title: string,
  slug: string,
  shortDescription: string,
  image: string,
  featured: boolean,
): Experience {
  const now = new Date();
  return {
    id,
    title,
    slug,
    shortDescription,
    description: 'Demo content — pending owner-verified experience details.',
    duration: '',
    price: '',
    imageUrl: `images/garden/${image}`,
    featured,
    status: 'PUBLISHED',
    createdAt: now,
    updatedAt: now,
  };
}

const EXPERIENCES: Experience[] = [
  makeExperience(
    1,
    'Garden Tour',
    'garden-tour',
    'A guided walk through the garden’s sculptures and planting.',
    'ero12.webp',
    true,
  ),
  makeExperience(
    2,
    'Art Exploration',
    'art-exploration',
    'A closer look at the artists and stories behind each installation.',
    'ero9.webp',
    true,
  ),
  makeExperience(
    3,
    'Tea House',
    'tea-house-experience',
    'Slow down with tea, coffee and homemade treats overlooking the garden.',
    'ero16.webp',
    true,
  ),
  makeExperience(
    4,
    'Private / Group Visit',
    'private-group-visit',
    'A tailored visit for private groups and special occasions.',
    'ero22.webp',
    false,
  ),
];

@Injectable()
export class ExperiencesService {
  findAll(): Experience[] {
    return EXPERIENCES.filter(
      (experience) => experience.status === 'PUBLISHED',
    );
  }

  findBySlug(slug: string): Experience {
    const experience = EXPERIENCES.find(
      (e) => e.slug === slug && e.status === 'PUBLISHED',
    );
    if (!experience) {
      throw new NotFoundException(`Experience with slug "${slug}" not found`);
    }
    return experience;
  }

  findById(id: number): Experience | undefined {
    return EXPERIENCES.find((e) => e.id === id);
  }
}
