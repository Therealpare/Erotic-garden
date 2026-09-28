import { Controller, Get, Param } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { Artwork } from './entities/artwork.entity';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get()
  findAll(): Artwork[] {
    return this.artworksService.findAll();
  }

  @Get('featured')
  findFeatured(): Artwork[] {
    return this.artworksService.findFeatured();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Artwork {
    return this.artworksService.findBySlug(slug);
  }
}
