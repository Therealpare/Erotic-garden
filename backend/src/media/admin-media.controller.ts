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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateMediaItemDto } from './dto/create-media-item.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaItemDto } from './dto/update-media-item.dto';
import { MediaItem } from './entities/media-item.entity';
import { MediaService } from './media.service';

@Controller('admin/media')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(@Query() query: QueryMediaDto): Promise<MediaItem[]> {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<MediaItem> {
    return this.mediaService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMediaItemDto): Promise<MediaItem> {
    return this.mediaService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaItemDto,
  ): Promise<MediaItem> {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.mediaService.remove(id);
  }
}
