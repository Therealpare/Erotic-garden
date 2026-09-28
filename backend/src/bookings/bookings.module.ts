import { Module } from '@nestjs/common';
import { ExperiencesModule } from '../experiences/experiences.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [ExperiencesModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
