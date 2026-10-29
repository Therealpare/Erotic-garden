import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CoffeeGuideService } from './coffee-guide.service';
import { UpdateCoffeeGuideEntryDto } from './dto/coffee-guide-entry.dto';
import { CoffeeGuideEntry } from './entities/coffee-guide-entry.entity';

@Controller('admin/coffee-guide')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminCoffeeGuideController {
  constructor(private readonly coffeeGuideService: CoffeeGuideService) {}

  @Get()
  findAll(): Promise<CoffeeGuideEntry[]> {
    return this.coffeeGuideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<CoffeeGuideEntry> {
    return this.coffeeGuideService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCoffeeGuideEntryDto,
  ): Promise<CoffeeGuideEntry> {
    return this.coffeeGuideService.update(id, dto);
  }
}
