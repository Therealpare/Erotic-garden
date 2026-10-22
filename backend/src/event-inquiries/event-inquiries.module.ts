import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEventInquiriesController } from './admin-event-inquiries.controller';
import { EventInquiry } from './entities/event-inquiry.entity';
import { EventInquiriesController } from './event-inquiries.controller';
import { EventInquiriesService } from './event-inquiries.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventInquiry])],
  controllers: [EventInquiriesController, AdminEventInquiriesController],
  providers: [EventInquiriesService],
})
export class EventInquiriesModule {}
