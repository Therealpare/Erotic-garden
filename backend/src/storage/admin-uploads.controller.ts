import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  MAX_IMAGE_BYTES,
  StorageService,
  StoredImage,
} from './storage.service';

@Controller('admin/uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminUploadsController {
  constructor(private readonly storage: StorageService) {}

  /** multipart/form-data with one `file` field; returns the URL to save on a gallery/menu/product record. */
  @Post('image')
  @HttpCode(201)
  // No `dest`/`storage` option: multer keeps the file in memory, so nothing touches disk before validation.
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File): Promise<StoredImage> {
    return this.storage.saveImage(file);
  }
}
