import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProductsController } from './admin-products.controller';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductVariant])],
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
