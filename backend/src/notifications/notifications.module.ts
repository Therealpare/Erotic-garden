import { Global, Module } from '@nestjs/common';
import { AdminNotificationsController } from './admin-notifications.controller';
import { LineService } from './line.service';

@Global()
@Module({
  controllers: [AdminNotificationsController],
  providers: [LineService],
  exports: [LineService],
})
export class NotificationsModule {}
