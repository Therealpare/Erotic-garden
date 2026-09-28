import { Controller, Get, Query } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { QueryGalleryDto } from './dto/query-gallery.dto';
import { GalleryCategory, GalleryImage } from './entities/gallery.entity';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  findAll(@Query() query: QueryGalleryDto): GalleryImage[] {
    return this.galleryService.findAll(query.category);
  }

  @Get('categories')
  findCategories(): GalleryCategory[] {
    return this.galleryService.findCategories();
  }
}
