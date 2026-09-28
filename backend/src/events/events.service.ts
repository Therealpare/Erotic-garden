import { Injectable, NotFoundException } from '@nestjs/common';
import { Event } from './entities/event.entity';

/**
 * No real events are scheduled yet — dates and capacity are real-world facts (spec §48)
 * that must never be invented. Populate through the admin CMS (Phase 8) when available.
 */
const EVENTS: Event[] = [];

@Injectable()
export class EventsService {
  findAll(): Event[] {
    return EVENTS.filter((event) => event.status === 'PUBLISHED');
  }

  findBySlug(slug: string): Event {
    const event = EVENTS.find(
      (e) => e.slug === slug && e.status === 'PUBLISHED',
    );
    if (!event) {
      throw new NotFoundException(`Event with slug "${slug}" not found`);
    }
    return event;
  }
}
