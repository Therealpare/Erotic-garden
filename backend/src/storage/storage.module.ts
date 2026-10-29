import { Global, Module } from '@nestjs/common';
import { AdminUploadsController } from './admin-uploads.controller';
import { StorageService } from './storage.service';

@Global()
@Module({
  controllers: [AdminUploadsController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
