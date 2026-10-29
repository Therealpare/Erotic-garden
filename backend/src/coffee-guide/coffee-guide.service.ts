import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cleanLocalized } from '../common/dto/localized-text.dto';
import { StorageService } from '../storage/storage.service';
import { UpdateCoffeeGuideEntryDto } from './dto/coffee-guide-entry.dto';
import { CoffeeGuideEntry } from './entities/coffee-guide-entry.entity';

export interface PublicCoffeeGuide {
  roastLevels: CoffeeGuideEntry[];
  processes: CoffeeGuideEntry[];
}

@Injectable()
export class CoffeeGuideService {
  constructor(
    @InjectRepository(CoffeeGuideEntry)
    private readonly entries: Repository<CoffeeGuideEntry>,
    private readonly storage: StorageService,
  ) {}

  async findPublic(): Promise<PublicCoffeeGuide> {
    const active = await this.entries.find({
      where: { status: 'ACTIVE' },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
    return {
      roastLevels: active.filter((entry) => entry.kind === 'ROAST'),
      processes: active.filter((entry) => entry.kind === 'PROCESS'),
    };
  }

  findAll(): Promise<CoffeeGuideEntry[]> {
    return this.entries.find({
      order: { kind: 'ASC', sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CoffeeGuideEntry> {
    const entry = await this.entries.findOneBy({ id });
    if (!entry)
      throw new NotFoundException(`Coffee guide entry ${id} not found`);
    return entry;
  }

  async update(
    id: number,
    dto: UpdateCoffeeGuideEntryDto,
  ): Promise<CoffeeGuideEntry> {
    const entry = await this.findOne(id);
    const previousImage = entry.imageUrl;

    if (dto.name) entry.name = cleanLocalized(dto.name);
    for (const field of ['summary', 'flavor', 'brewing'] as const) {
      if (dto[field]) entry[field] = cleanLocalized(dto[field]);
    }
    if (dto.imageUrl !== undefined) entry.imageUrl = dto.imageUrl;
    if (dto.imageAlt !== undefined)
      entry.imageAlt = dto.imageAlt?.trim() || null;
    if (dto.status) entry.status = dto.status;
    if (dto.sortOrder !== undefined) entry.sortOrder = dto.sortOrder;
    const saved = await this.entries.save(entry);

    if (dto.imageUrl !== undefined && dto.imageUrl !== previousImage)
      await this.storage.removeIfLocal(previousImage);
    return saved;
  }
}
