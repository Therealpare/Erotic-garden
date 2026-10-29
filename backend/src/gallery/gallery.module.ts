import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminGalleryController } from './admin-gallery.controller';
import { GalleryCategory } from './entities/gallery-category.entity';
import { GalleryImage } from './entities/gallery-image.entity';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [TypeOrmModule.forFeature([GalleryCategory, GalleryImage])],
  controllers: [GalleryController, AdminGalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
