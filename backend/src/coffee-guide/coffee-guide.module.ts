import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCoffeeGuideController } from './admin-coffee-guide.controller';
import { CoffeeGuideController } from './coffee-guide.controller';
import { CoffeeGuideService } from './coffee-guide.service';
import { CoffeeGuideEntry } from './entities/coffee-guide-entry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CoffeeGuideEntry])],
  controllers: [CoffeeGuideController, AdminCoffeeGuideController],
  providers: [CoffeeGuideService],
})
export class CoffeeGuideModule {}
