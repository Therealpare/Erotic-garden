import { Controller, Get } from '@nestjs/common';
import { CoffeeGuideService, PublicCoffeeGuide } from './coffee-guide.service';

@Controller('coffee-guide')
export class CoffeeGuideController {
  constructor(private readonly coffeeGuideService: CoffeeGuideService) {}

  @Get()
  find(): Promise<PublicCoffeeGuide> {
    return this.coffeeGuideService.findPublic();
  }
}
