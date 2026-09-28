export type EventStatus = 'PUBLISHED' | 'DRAFT';

/** Mirrors spec §35 `events` table. */
export class Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  startAt: Date;
  endAt: Date;
  location: string;
  imageUrl: string;
  capacity: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}
