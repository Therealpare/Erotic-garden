import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import {
  CreateGalleryImageDto,
  UpdateGalleryImageDto,
} from './dto/gallery-image.dto';
import { GalleryCategory } from './entities/gallery-category.entity';
import { GalleryImage } from './entities/gallery-image.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GalleryCategory)
    private readonly categories: Repository<GalleryCategory>,
    @InjectRepository(GalleryImage)
    private readonly images: Repository<GalleryImage>,
    private readonly storage: StorageService,
  ) {}

  findCategories(): Promise<GalleryCategory[]> {
    return this.categories.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  /** Public listing: published images only, optionally for one category slug. */
  findPublished(categorySlug?: string): Promise<GalleryImage[]> {
    return this.images.find({
      where: {
        isPublished: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      relations: { category: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  findAll(): Promise<GalleryImage[]> {
    return this.images.find({
      relations: { category: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GalleryImage> {
    const image = await this.images.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!image) throw new NotFoundException(`Gallery image ${id} not found`);
    return image;
  }

  async create(dto: CreateGalleryImageDto): Promise<GalleryImage> {
    await this.assertCategory(dto.categoryId);
    const saved = await this.images.save(
      this.images.create({
        ...dto,
        title: dto.title.trim(),
        altText: dto.altText.trim(),
        description: dto.description?.trim() ?? '',
      }),
    );
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateGalleryImageDto): Promise<GalleryImage> {
    // Loaded without the relation so `categoryId` alone decides the category on save.
    const image = await this.images.findOneBy({ id });
    if (!image) throw new NotFoundException(`Gallery image ${id} not found`);
    if (dto.categoryId !== undefined) await this.assertCategory(dto.categoryId);
    const previousUrl = image.imageUrl;

    Object.assign(image, dto);
    if (dto.title !== undefined) image.title = dto.title.trim();
    if (dto.altText !== undefined) image.altText = dto.altText.trim();
    if (dto.description !== undefined)
      image.description = dto.description.trim();
    await this.images.save(image);

    if (dto.imageUrl && dto.imageUrl !== previousUrl)
      await this.storage.removeIfLocal(previousUrl);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const image = await this.findOne(id);
    await this.images.delete(id);
    await this.storage.removeIfLocal(image.imageUrl);
  }

  private async assertCategory(id: number): Promise<void> {
    if (!(await this.categories.exist({ where: { id } }))) {
      throw new BadRequestException(`Gallery category ${id} does not exist`);
    }
  }
}
