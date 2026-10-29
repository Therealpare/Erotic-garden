import { Controller, Get, Query } from '@nestjs/common';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import { GalleryCategory } from './entities/gallery-category.entity';
import { GalleryImage } from './entities/gallery-image.entity';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Query() query: QueryGalleryDto): Promise<GalleryImage[]> {
    return this.galleryService.findPublished(query.category);
  }

  @Get('categories')
  findCategories(): Promise<GalleryCategory[]> {
    return this.galleryService.findCategories();
  }
}
