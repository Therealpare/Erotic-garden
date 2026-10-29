import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateGalleryImageDto,
  UpdateGalleryImageDto,
} from './dto/gallery-image.dto';
import { GalleryCategory } from './entities/gallery-category.entity';
import { GalleryImage } from './entities/gallery-image.entity';
import { GalleryService } from './gallery.service';

@Controller('admin/gallery')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminGalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get('categories')
  findCategories(): Promise<GalleryCategory[]> {
    return this.galleryService.findCategories();
  }

  @Get()
  findAll(): Promise<GalleryImage[]> {
    return this.galleryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GalleryImage> {
    return this.galleryService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGalleryImageDto): Promise<GalleryImage> {
    return this.galleryService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGalleryImageDto,
  ): Promise<GalleryImage> {
    return this.galleryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.galleryService.remove(id);
  }
}
