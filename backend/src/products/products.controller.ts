import { Controller, Get } from '@nestjs/common';
import { ProductsService, PublicProduct } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<PublicProduct[]> {
    return this.productsService.findPublic();
  }
}
