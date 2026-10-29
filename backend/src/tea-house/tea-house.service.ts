import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { cleanLocalized } from '../common/dto/localized-text.dto';
import { StorageService } from '../storage/storage.service';
import {
  CreateTeaMenuItemDto,
  UpdateTeaMenuItemDto,
} from './dto/tea-menu-item.dto';
import { TeaCategory } from './entities/tea-category.entity';
import { TeaMenuItem } from './entities/tea-menu-item.entity';

const UNIQUE_VIOLATION = '23505';

@Injectable()
export class TeaHouseService {
  constructor(
    @InjectRepository(TeaCategory)
    private readonly categories: Repository<TeaCategory>,
    @InjectRepository(TeaMenuItem)
    private readonly items: Repository<TeaMenuItem>,
    private readonly storage: StorageService,
  ) {}

  findCategories(): Promise<TeaCategory[]> {
    return this.categories.find({ order: { sortOrder: 'ASC', id: 'ASC' } });
  }

  /** Public menu: everything except HIDDEN items; SOLD_OUT items stay visible so guests know. */
  findPublicMenu(): Promise<TeaMenuItem[]> {
    return this.items.find({
      where: { status: Not('HIDDEN') },
      relations: { category: true },
      order: { category: { sortOrder: 'ASC' }, sortOrder: 'ASC', id: 'ASC' },
    });
  }

  findAll(): Promise<TeaMenuItem[]> {
    return this.items.find({
      relations: { category: true },
      order: { category: { sortOrder: 'ASC' }, sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TeaMenuItem> {
    const item = await this.items.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!item) throw new NotFoundException(`Menu item ${id} not found`);
    return item;
  }

  async create(dto: CreateTeaMenuItemDto): Promise<TeaMenuItem> {
    await this.assertCategory(dto.categoryId);
    const item = this.items.create({
      ...dto,
      name: cleanLocalized(dto.name),
      description: cleanLocalized(dto.description),
      price: dto.price ?? null,
      imageUrl: dto.imageUrl ?? null,
    });
    const saved = await this.saveUnique(item);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateTeaMenuItemDto): Promise<TeaMenuItem> {
    const item = await this.items.findOneBy({ id });
    if (!item) throw new NotFoundException(`Menu item ${id} not found`);
    if (dto.categoryId !== undefined) await this.assertCategory(dto.categoryId);
    const previousImage = item.imageUrl;

    Object.assign(item, dto);
    if (dto.name) item.name = cleanLocalized(dto.name);
    if (dto.description) item.description = cleanLocalized(dto.description);
    await this.saveUnique(item);

    if (dto.imageUrl !== undefined && dto.imageUrl !== previousImage)
      await this.storage.removeIfLocal(previousImage);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.items.delete(id);
    await this.storage.removeIfLocal(item.imageUrl);
  }

  private async saveUnique(item: TeaMenuItem): Promise<TeaMenuItem> {
    try {
      return await this.items.save(item);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { code?: string }).code ===
          UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `A menu item with slug "${item.slug}" already exists`,
        );
      }
      throw error;
    }
  }

  private async assertCategory(id: number): Promise<void> {
    if (!(await this.categories.exist({ where: { id } }))) {
      throw new BadRequestException(`Menu category ${id} does not exist`);
    }
  }
}
