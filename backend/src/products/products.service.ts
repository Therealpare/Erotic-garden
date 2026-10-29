import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  In,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { cleanLocalized } from '../common/dto/localized-text.dto';
import { StorageService } from '../storage/storage.service';
import {
  CreateProductDto,
  ProductVariantInputDto,
  UpdateProductDto,
} from './dto/product.dto';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';

const UNIQUE_VIOLATION = '23505';

export type PublicVariant = Pick<
  ProductVariant,
  'id' | 'label' | 'price' | 'currency' | 'stock'
> & { soldOut: boolean };
export type PublicProduct = Omit<
  Product,
  'variants' | 'status' | 'createdAt' | 'updatedAt'
> & { variants: PublicVariant[] };

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variants: Repository<ProductVariant>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly storage: StorageService,
  ) {}

  /** Shop listing: ACTIVE products and their ACTIVE sizes. A size with stock 0 is returned as soldOut. */
  async findPublic(): Promise<PublicProduct[]> {
    const products = await this.products.find({
      where: { status: 'ACTIVE' },
      relations: { images: true, variants: true },
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
        images: { sortOrder: 'ASC', id: 'ASC' },
        variants: { sortOrder: 'ASC', id: 'ASC' },
      },
    });
    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      origin: product.origin,
      process: product.process,
      roastLevel: product.roastLevel,
      tastingNotes: product.tastingNotes,
      sortOrder: product.sortOrder,
      images: product.images,
      variants: product.variants
        .filter((variant) => variant.status === 'ACTIVE')
        .map(({ id, label, price, currency, stock }) => ({
          id,
          label,
          price,
          currency,
          stock,
          soldOut: stock <= 0,
        })),
    }));
  }

  findAll(): Promise<Product[]> {
    return this.products.find({
      relations: { images: true, variants: true },
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
        images: { sortOrder: 'ASC', id: 'ASC' },
        variants: { sortOrder: 'ASC', id: 'ASC' },
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.products.findOne({
      where: { id },
      relations: { images: true, variants: true },
      order: {
        images: { sortOrder: 'ASC', id: 'ASC' },
        variants: { sortOrder: 'ASC', id: 'ASC' },
      },
    });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    this.assertDistinctLabels(dto.variants);
    const id = await this.withUniqueErrors(() =>
      this.dataSource.transaction(async (manager) => {
        const product = await manager.save(
          manager.create(Product, {
            ...this.productFields(dto),
            slug: dto.slug,
          }),
        );
        await this.replaceImages(manager, product.id, dto.images ?? []);
        await this.syncVariants(manager, product.id, dto.variants ?? []);
        return product.id;
      }),
    );
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    this.assertDistinctLabels(dto.variants);
    const removedImages: string[] = [];
    await this.withUniqueErrors(() =>
      this.dataSource.transaction(async (manager) => {
        const product = await manager.findOne(Product, {
          where: { id },
          relations: { images: true },
        });
        if (!product) throw new NotFoundException(`Product ${id} not found`);

        await manager.update(Product, id, {
          ...this.productFields(dto),
          ...(dto.slug ? { slug: dto.slug } : {}),
        });
        if (dto.images) {
          const kept = new Set(dto.images.map((image) => image.imageUrl));
          removedImages.push(
            ...product.images
              .map((image) => image.imageUrl)
              .filter((url) => !kept.has(url)),
          );
          await this.replaceImages(manager, id, dto.images);
        }
        if (dto.variants) await this.syncVariants(manager, id, dto.variants);
      }),
    );
    await Promise.all(
      removedImages.map((url) => this.storage.removeIfLocal(url)),
    );
    return this.findOne(id);
  }

  /** Quick stock edit for one size; setting it above 0 clears SOLD OUT automatically. */
  async updateStock(variantId: number, stock: number): Promise<ProductVariant> {
    const result = await this.variants.update(variantId, { stock });
    if (!result.affected)
      throw new NotFoundException(`Product size ${variantId} not found`);
    return this.variants.findOneByOrFail({ id: variantId });
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.products.delete(id); // images and sizes cascade; past order lines keep their own snapshot
    await Promise.all(
      product.images.map((image) => this.storage.removeIfLocal(image.imageUrl)),
    );
  }

  private productFields(dto: UpdateProductDto): Partial<Product> {
    const fields: Partial<Product> = {};
    if (dto.name) fields.name = cleanLocalized(dto.name);
    if (dto.description) fields.description = cleanLocalized(dto.description);
    for (const key of [
      'origin',
      'process',
      'roastLevel',
      'tastingNotes',
    ] as const) {
      if (dto[key] !== undefined) fields[key] = dto[key]?.trim() || null;
    }
    if (dto.status) fields.status = dto.status;
    if (dto.sortOrder !== undefined) fields.sortOrder = dto.sortOrder;
    return fields;
  }

  private async replaceImages(
    manager: EntityManager,
    productId: number,
    images: CreateProductDto['images'],
  ): Promise<void> {
    await manager.delete(ProductImage, { productId });
    if (!images?.length) return;
    await manager.insert(
      ProductImage,
      images.map((image, index) => ({
        productId,
        imageUrl: image.imageUrl,
        altText: image.altText.trim(),
        sortOrder: image.sortOrder ?? index,
      })),
    );
  }

  private async syncVariants(
    manager: EntityManager,
    productId: number,
    inputs: ProductVariantInputDto[],
  ): Promise<void> {
    const existing = await manager.find(ProductVariant, {
      where: { productId },
    });
    const existingIds = new Set(existing.map((variant) => variant.id));
    const foreign = inputs.filter(
      (input) => input.id !== undefined && !existingIds.has(input.id),
    );
    if (foreign.length)
      throw new BadRequestException(
        `Size id ${foreign[0].id} does not belong to this product`,
      );

    const keepIds = inputs
      .map((input) => input.id)
      .filter((value): value is number => value !== undefined);
    const toDelete = existing
      .filter((variant) => !keepIds.includes(variant.id))
      .map((variant) => variant.id);
    if (toDelete.length)
      await manager.delete(ProductVariant, { id: In(toDelete) });

    for (const [index, input] of inputs.entries()) {
      const values = {
        productId,
        label: input.label.trim(),
        sku: input.sku?.trim() || null,
        price: input.price,
        currency: input.currency ?? 'THB',
        stock: input.stock,
        status: input.status ?? 'ACTIVE',
        sortOrder: input.sortOrder ?? index,
      };
      if (input.id) await manager.update(ProductVariant, input.id, values);
      else await manager.insert(ProductVariant, values);
    }
  }

  private assertDistinctLabels(variants?: ProductVariantInputDto[]): void {
    const labels = (variants ?? []).map((variant) =>
      variant.label.trim().toLowerCase(),
    );
    if (new Set(labels).size !== labels.length)
      throw new BadRequestException(
        'Each size label must be unique within a product',
      );
  }

  private async withUniqueErrors<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as QueryFailedError & { code?: string }).code ===
          UNIQUE_VIOLATION
      ) {
        const detail =
          (error as QueryFailedError & { detail?: string }).detail ?? '';
        const field = /\((\w+)\)/.exec(detail)?.[1] ?? 'value';
        throw new ConflictException(
          `That ${field === 'product_id' ? 'size label' : field} is already in use`,
        );
      }
      throw error;
    }
  }
}
