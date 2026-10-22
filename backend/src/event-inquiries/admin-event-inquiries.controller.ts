import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { QueryEventInquiriesDto } from './dto/query-event-inquiries.dto';
import { UpdateEventInquiryDto } from './dto/update-event-inquiry.dto';
import { EventInquiry } from './entities/event-inquiry.entity';
import { EventInquiriesService, Paginated } from './event-inquiries.service';

@Controller('admin/event-inquiries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminEventInquiriesController {
  constructor(private readonly service: EventInquiriesService) {}

  @Get()
  findAll(
    @Query() query: QueryEventInquiriesDto,
  ): Promise<Paginated<EventInquiry>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<EventInquiry> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventInquiryDto,
  ): Promise<EventInquiry> {
    return this.service.update(id, dto);
  }
}
