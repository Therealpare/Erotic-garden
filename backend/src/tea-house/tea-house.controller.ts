import { Controller, Get } from '@nestjs/common';
import { TeaHouseService } from './tea-house.service';
import { TeaCategory, TeaMenuItem } from './entities/tea-menu.entity';

@Controller('tea')
export class TeaHouseController {
  constructor(private readonly teaHouseService: TeaHouseService) {}

  @Get('categories')
  findCategories(): TeaCategory[] {
    return this.teaHouseService.findCategories();
  }

  @Get('menu')
  findMenu(): TeaMenuItem[] {
    return this.teaHouseService.findMenu();
  }
}
