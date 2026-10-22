import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  MEDIA_STATUSES,
  MEDIA_TYPES,
  MediaStatus,
  MediaType,
} from '../media.constants';

/** Press and video coverage of the garden, managed through /admin/media. */
@Entity('media_items')
@Index(['status', 'type'])
export class MediaItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MEDIA_TYPES, enumName: 'media_type' })
  type: MediaType;

  @Column({ length: 200 })
  title: string;

  /** Publication, channel or programme name, e.g. the magazine or TV show. */
  @Column({ length: 120 })
  source: string;

  @Column({ length: 500 })
  url: string;

  /** Derived from `url` on save; set only when the link is a YouTube video. */
  @Column({
    name: 'youtube_video_id',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  youtubeVideoId: string | null;

  @Column({
    name: 'thumbnail_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnailUrl: string | null;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ name: 'published_at', type: 'date', nullable: true })
  publishedAt: string | null;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({
    type: 'enum',
    enum: MEDIA_STATUSES,
    enumName: 'media_status',
    default: 'DRAFT',
  })
  status: MediaStatus;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
