import { Controller, Get } from '@nestjs/common';
import { TeaCategory } from './entities/tea-category.entity';
import { TeaMenuItem } from './entities/tea-menu-item.entity';
import { TeaHouseService } from './tea-house.service';

@Controller('tea')
export class TeaHouseController {
  constructor(private readonly teaHouseService: TeaHouseService) {}

  @Get('categories')
  findCategories(): Promise<TeaCategory[]> {
    return this.teaHouseService.findCategories();
  }

  @Get('menu')
  findMenu(): Promise<TeaMenuItem[]> {
    return this.teaHouseService.findPublicMenu();
  }
}
