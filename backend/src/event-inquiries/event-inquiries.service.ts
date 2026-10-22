import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { Brackets, Repository } from 'typeorm';
import { LineMessagingService } from '../notifications/line-messaging.service';
import { CreateEventInquiryDto } from './dto/create-event-inquiry.dto';
import { QueryEventInquiriesDto } from './dto/query-event-inquiries.dto';
import { UpdateEventInquiryDto } from './dto/update-event-inquiry.dto';
import { EventInquiry } from './entities/event-inquiry.entity';

export interface InquiryReceipt {
  referenceCode: string;
  status: 'RECEIVED';
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class EventInquiriesService {
  private readonly logger = new Logger(EventInquiriesService.name);

  constructor(
    @InjectRepository(EventInquiry)
    private readonly inquiries: Repository<EventInquiry>,
    private readonly line: LineMessagingService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateEventInquiryDto): Promise<InquiryReceipt> {
    const today = new Date().toISOString().slice(0, 10);
    if (dto.preferredDate < today) {
      throw new BadRequestException('preferredDate must not be in the past');
    }

    const referenceCode = this.generateReferenceCode();

    // Honeypot filled: answer like a success so bots learn nothing, but store nothing.
    if (dto.website) {
      this.logger.warn('Event inquiry dropped by honeypot');
      return { referenceCode, status: 'RECEIVED' };
    }

    const inquiry = await this.inquiries.save(
      this.inquiries.create({
        referenceCode,
        name: dto.name.trim(),
        email: dto.email.trim(),
        phone: dto.phone.trim(),
        organization: dto.organization?.trim() || null,
        eventType: dto.eventType,
        preferredDate: dto.preferredDate,
        flexibleDate: dto.flexibleDate ?? false,
        guestCount: dto.guestCount,
        contactPreference: dto.contactPreference ?? 'EMAIL',
        lineId:
          dto.contactPreference === 'LINE' ? dto.lineId?.trim() || null : null,
        message: dto.message.trim(),
      }),
    );

    // The inquiry is already safe in PostgreSQL; the LINE alert must never delay or fail the visitor's request.
    void this.notifyStaff(inquiry);

    return { referenceCode: inquiry.referenceCode, status: 'RECEIVED' };
  }

  async findAll(
    query: QueryEventInquiriesDto,
  ): Promise<Paginated<EventInquiry>> {
    const qb = this.inquiries
      .createQueryBuilder('i')
      .orderBy('i.created_at', 'DESC');

    if (query.status)
      qb.andWhere('i.status = :status', { status: query.status });
    if (query.search?.trim()) {
      const term = `%${query.search.trim().replace(/[%_\\]/g, '\\$&')}%`;
      qb.andWhere(
        new Brackets((w) =>
          w
            .where('i.name ILIKE :term', { term })
            .orWhere('i.email ILIKE :term', { term })
            .orWhere('i.phone ILIKE :term', { term })
            .orWhere('i.reference_code ILIKE :term', { term }),
        ),
      );
    }

    const [items, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return { items, total, page: query.page, limit: query.limit };
  }

  async findOne(id: number): Promise<EventInquiry> {
    const inquiry = await this.inquiries.findOne({ where: { id } });
    if (!inquiry) throw new NotFoundException(`Event inquiry ${id} not found`);
    return inquiry;
  }

  async update(id: number, dto: UpdateEventInquiryDto): Promise<EventInquiry> {
    const inquiry = await this.findOne(id);
    if (dto.status) inquiry.status = dto.status;
    if (dto.adminNotes !== undefined)
      inquiry.adminNotes = dto.adminNotes.trim() || null;
    return this.inquiries.save(inquiry);
  }

  private async notifyStaff(inquiry: EventInquiry): Promise<void> {
    const adminUrl = this.config.get<string>('ADMIN_BASE_URL');
    const lines = [
      `🌿 New event inquiry ${inquiry.referenceCode}`,
      `Type: ${inquiry.eventType}`,
      `Date: ${inquiry.preferredDate}${inquiry.flexibleDate ? ' (flexible)' : ''}`,
      `Guests: ${inquiry.guestCount}`,
      `Name: ${inquiry.name}${inquiry.organization ? ` — ${inquiry.organization}` : ''}`,
      `Phone: ${inquiry.phone}`,
      `Email: ${inquiry.email}`,
      `Prefers: ${inquiry.contactPreference}${inquiry.lineId ? ` (${inquiry.lineId})` : ''}`,
      '',
      inquiry.message.length > 500
        ? `${inquiry.message.slice(0, 500)}…`
        : inquiry.message,
    ];
    if (adminUrl)
      lines.push(
        '',
        `${adminUrl.replace(/\/$/, '')}/admin/events/${inquiry.id}`,
      );

    if (await this.line.pushText(lines.join('\n'))) {
      await this.inquiries
        .update(inquiry.id, { lineNotifiedAt: new Date() })
        .catch((error) =>
          this.logger.error(
            `Could not record LINE notification: ${error.message}`,
          ),
        );
    }
  }

  private generateReferenceCode(): string {
    return `EV-${randomBytes(4).toString('hex').toUpperCase()}`;
  }
}
