import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { MediaItem } from './entities/media-item.entity';
import { extractYoutubeId } from './youtube.util';

const ORDER = {
  sortOrder: 'ASC',
  publishedAt: { direction: 'DESC', nulls: 'LAST' },
  createdAt: 'DESC',
} as const;

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaItem) private readonly media: Repository<MediaItem>,
  ) {}

  findPublished(query: QueryMediaDto): Promise<MediaItem[]> {
    const where: FindOptionsWhere<MediaItem> = { status: 'PUBLISHED' };
    if (query.type) where.type = query.type;
    return this.media.find({ where, order: ORDER });
  }

  /** The Home page's Featured Video: a published, featured item that can be embedded from YouTube. */
  async findFeaturedVideo(): Promise<MediaItem | null> {
    return this.media
      .createQueryBuilder('m')
      .where('m.status = :status', { status: 'PUBLISHED' })
      .andWhere('m.is_featured = true')
      .andWhere('m.youtube_video_id IS NOT NULL')
      .orderBy('m.sort_order', 'ASC')
      .addOrderBy('m.updated_at', 'DESC')
      .getOne();
  }

  findAll(query: QueryMediaDto): Promise<MediaItem[]> {
    const where: FindOptionsWhere<MediaItem> = {};
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    return this.media.find({ where, order: ORDER });
  }

  async findOne(id: number): Promise<MediaItem> {
    const item = await this.media.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Media item ${id} not found`);
    return item;
  }

  create(dto: CreateMediaItemDto): Promise<MediaItem> {
    const item = this.media.create(dto);
    this.applyDerivedFields(item);
    return this.media.save(item);
  }

  async update(id: number, dto: UpdateMediaItemDto): Promise<MediaItem> {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    this.applyDerivedFields(item);
    return this.media.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.media.delete(id);
    if (!result.affected)
      throw new NotFoundException(`Media item ${id} not found`);
  }

  private applyDerivedFields(item: MediaItem): void {
    item.youtubeVideoId = extractYoutubeId(item.url);
    if (item.isFeatured && !item.youtubeVideoId) {
      throw new BadRequestException(
        'Only YouTube videos can be featured on the Home page',
      );
    }
  }
}
