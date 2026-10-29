import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import {
  CreateTeaMenuItemDto,
  UpdateTeaMenuItemDto,
} from './dto/tea-menu-item.dto';
import { TeaCategory } from './entities/tea-category.entity';
import { TeaMenuItem } from './entities/tea-menu-item.entity';
import { TeaHouseService } from './tea-house.service';

@Controller('admin/tea')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'EDITOR')
export class AdminTeaHouseController {
  constructor(private readonly teaHouseService: TeaHouseService) {}

  @Get('categories')
  findCategories(): Promise<TeaCategory[]> {
    return this.teaHouseService.findCategories();
  }

  @Get('items')
  findAll(): Promise<TeaMenuItem[]> {
    return this.teaHouseService.findAll();
  }

  @Get('items/:id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<TeaMenuItem> {
    return this.teaHouseService.findOne(id);
  }

  @Post('items')
  create(@Body() dto: CreateTeaMenuItemDto): Promise<TeaMenuItem> {
    return this.teaHouseService.create(dto);
  }

  @Patch('items/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeaMenuItemDto,
  ): Promise<TeaMenuItem> {
    return this.teaHouseService.update(id, dto);
  }

  @Delete('items/:id')
  @Roles('ADMIN')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.teaHouseService.remove(id);
  }
}
