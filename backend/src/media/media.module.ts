import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMediaController } from './admin-media.controller';
import { MediaItem } from './entities/media-item.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaItem])],
  controllers: [MediaController, AdminMediaController],
  providers: [MediaService],
})
export class MediaModule {}
