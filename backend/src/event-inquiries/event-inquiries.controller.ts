import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateEventInquiryDto } from './dto/create-event-inquiry.dto';
import {
  EventInquiriesService,
  InquiryReceipt,
} from './event-inquiries.service';

@Controller('event-inquiries')
export class EventInquiriesController {
  constructor(private readonly service: EventInquiriesService) {}

  /** A real visitor sends one inquiry; this limit only bites on floods from a single IP. */
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  @Post()
  create(@Body() dto: CreateEventInquiryDto): Promise<InquiryReceipt> {
    return this.service.create(dto);
  }
}
