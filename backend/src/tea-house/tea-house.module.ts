import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminTeaHouseController } from './admin-tea-house.controller';
import { TeaCategory } from './entities/tea-category.entity';
import { TeaMenuItem } from './entities/tea-menu-item.entity';
import { TeaHouseController } from './tea-house.controller';
import { TeaHouseService } from './tea-house.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeaCategory, TeaMenuItem])],
  controllers: [TeaHouseController, AdminTeaHouseController],
  providers: [TeaHouseService],
})
export class TeaHouseModule {}
