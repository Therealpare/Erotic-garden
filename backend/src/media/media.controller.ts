import { Controller, Get, Query } from '@nestjs/common';
import { QueryMediaDto } from './dto/query-media.dto';
import { MediaItem } from './entities/media-item.entity';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Query() query: QueryMediaDto): Promise<MediaItem[]> {
    return this.mediaService.findPublished({ type: query.type });
  }

  @Get('featured')
  async findFeatured(): Promise<{ item: MediaItem | null }> {
    return { item: await this.mediaService.findFeaturedVideo() };
  }
}
