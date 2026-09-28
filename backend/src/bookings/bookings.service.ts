import { BadRequestException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { ExperiencesService } from '../experiences/experiences.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';

/** In-memory store — replace with a real repository in Phase 5. */
const BOOKINGS: Booking[] = [];
let nextId = 1;

@Injectable()
export class BookingsService {
  constructor(private readonly experiencesService: ExperiencesService) {}

  create(dto: CreateBookingDto): Booking {
    if (!this.experiencesService.findById(dto.experienceId)) {
      throw new BadRequestException(
        `Experience with id ${dto.experienceId} does not exist`,
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(dto.visitDate) < today) {
      throw new BadRequestException('visitDate must not be in the past');
    }

    const now = new Date();
    const booking: Booking = {
      id: nextId++,
      bookingCode: this.generateBookingCode(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      visitDate: dto.visitDate,
      preferredTime: dto.preferredTime,
      guestCount: dto.guestCount,
      experienceId: dto.experienceId,
      message: dto.message ?? '',
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    BOOKINGS.push(booking);
    return booking;
  }

  findAll(): Booking[] {
    return BOOKINGS;
  }

  private generateBookingCode(): string {
    const random = randomBytes(4).toString('hex').toUpperCase();
    return `EG-${random}`;
  }
}
