import { Controller, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Event[] {
    return this.eventsService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Event {
    return this.eventsService.findBySlug(slug);
  }
}
