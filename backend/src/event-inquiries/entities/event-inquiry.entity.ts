import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CONTACT_PREFERENCES,
  ContactPreference,
  EVENT_TYPES,
  EventType,
  INQUIRY_STATUSES,
  InquiryStatus,
} from '../event-inquiry.constants';

/** A request to host a private event at the garden, submitted from /events. */
@Entity('event_inquiries')
@Index(['status', 'createdAt'])
export class EventInquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reference_code', length: 16, unique: true })
  referenceCode: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 40 })
  phone: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  organization: string | null;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: EVENT_TYPES,
    enumName: 'event_type',
  })
  eventType: EventType;

  @Column({ name: 'preferred_date', type: 'date' })
  preferredDate: string;

  @Column({ name: 'flexible_date', default: false })
  flexibleDate: boolean;

  @Column({ name: 'guest_count' })
  guestCount: number;

  @Column({
    name: 'contact_preference',
    type: 'enum',
    enum: CONTACT_PREFERENCES,
    enumName: 'contact_preference',
    default: 'EMAIL',
  })
  contactPreference: ContactPreference;

  @Column({ name: 'line_id', type: 'varchar', length: 60, nullable: true })
  lineId: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: INQUIRY_STATUSES,
    enumName: 'inquiry_status',
    default: 'NEW',
  })
  status: InquiryStatus;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string | null;

  /** Set once the LINE OA alert for this inquiry was accepted by LINE. */
  @Column({ name: 'line_notified_at', type: 'timestamptz', nullable: true })
  lineNotifiedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
