import { Module } from '@nestjs/common';
import { TeaHouseController } from './tea-house.controller';
import { TeaHouseService } from './tea-house.service';

@Module({
  controllers: [TeaHouseController],
  providers: [TeaHouseService],
})
export class TeaHouseModule {}
