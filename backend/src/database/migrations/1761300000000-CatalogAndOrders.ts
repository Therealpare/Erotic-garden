import { MigrationInterface, QueryRunner } from 'typeorm';

/** Gallery, tea house menu, coffee products with per-size stock, and orders. */
export class CatalogAndOrders1761300000000 implements MigrationInterface {
  name = 'CatalogAndOrders1761300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Gallery ---
    await queryRunner.query(`
      CREATE TABLE "gallery_categories" (
        "id" SERIAL PRIMARY KEY,
        "slug" varchar(60) NOT NULL UNIQUE,
        "name" varchar(120) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0
      )`);
    await queryRunner.query(`
      CREATE TABLE "gallery_images" (
        "id" SERIAL PRIMARY KEY,
        "category_id" integer NOT NULL REFERENCES "gallery_categories" ("id") ON DELETE RESTRICT,
        "title" varchar(200) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "image_url" varchar(500) NOT NULL,
        "alt_text" varchar(300) NOT NULL,
        "featured" boolean NOT NULL DEFAULT false,
        "is_published" boolean NOT NULL DEFAULT true,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_gallery_images_category" ON "gallery_images" ("category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_gallery_images_published_sort" ON "gallery_images" ("is_published", "sort_order")`,
    );

    // --- Tea house menu ---
    await queryRunner.query(
      `CREATE TYPE "menu_item_status" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'HIDDEN')`,
    );
    await queryRunner.query(`
      CREATE TABLE "tea_categories" (
        "id" SERIAL PRIMARY KEY,
        "key" varchar(40) NOT NULL UNIQUE,
        "name" varchar(120) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0
      )`);
    await queryRunner.query(`
      CREATE TABLE "tea_menu_items" (
        "id" SERIAL PRIMARY KEY,
        "category_id" integer NOT NULL REFERENCES "tea_categories" ("id") ON DELETE RESTRICT,
        "slug" varchar(80) NOT NULL UNIQUE,
        "name" jsonb NOT NULL,
        "description" jsonb NOT NULL DEFAULT '{}',
        "price" numeric(10,2) CHECK ("price" IS NULL OR "price" >= 0),
        "included_in_admission" boolean NOT NULL DEFAULT false,
        "image_url" varchar(500),
        "status" "menu_item_status" NOT NULL DEFAULT 'AVAILABLE',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_tea_menu_items_category_sort" ON "tea_menu_items" ("category_id", "sort_order")`,
    );

    // --- Coffee products, images and sizes (variants) ---
    await queryRunner.query(
      `CREATE TYPE "product_status" AS ENUM ('ACTIVE', 'HIDDEN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "variant_status" AS ENUM ('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" SERIAL PRIMARY KEY,
        "slug" varchar(80) NOT NULL UNIQUE,
        "name" jsonb NOT NULL,
        "description" jsonb NOT NULL DEFAULT '{}',
        "origin" varchar(160),
        "process" varchar(160),
        "roast_level" varchar(80),
        "tasting_notes" varchar(300),
        "status" "product_status" NOT NULL DEFAULT 'ACTIVE',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(`
      CREATE TABLE "product_images" (
        "id" SERIAL PRIMARY KEY,
        "product_id" integer NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
        "image_url" varchar(500) NOT NULL,
        "alt_text" varchar(300) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_product_images_product" ON "product_images" ("product_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE "product_variants" (
        "id" SERIAL PRIMARY KEY,
        "product_id" integer NOT NULL REFERENCES "products" ("id") ON DELETE CASCADE,
        "label" varchar(40) NOT NULL,
        "sku" varchar(60) UNIQUE,
        "price" numeric(10,2) NOT NULL CHECK ("price" >= 0),
        "currency" char(3) NOT NULL DEFAULT 'THB',
        "stock" integer NOT NULL DEFAULT 0 CONSTRAINT "CHK_product_variants_stock_non_negative" CHECK ("stock" >= 0),
        "status" "variant_status" NOT NULL DEFAULT 'ACTIVE',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_product_variants_product_label" UNIQUE ("product_id", "label")
      )`);

    // --- Orders ---
    await queryRunner.query(
      `CREATE TYPE "order_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" SERIAL PRIMARY KEY,
        "order_number" varchar(16) NOT NULL UNIQUE,
        "name" varchar(120) NOT NULL,
        "phone" varchar(40) NOT NULL,
        "address" text NOT NULL,
        "contact_channel" varchar(120) NOT NULL,
        "total_amount" numeric(12,2) NOT NULL CHECK ("total_amount" >= 0),
        "currency" char(3) NOT NULL DEFAULT 'THB',
        "status" "order_status" NOT NULL DEFAULT 'PENDING',
        "line_notified_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_status_created" ON "orders" ("status", "created_at")`,
    );
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" SERIAL PRIMARY KEY,
        "order_id" integer NOT NULL REFERENCES "orders" ("id") ON DELETE CASCADE,
        "variant_id" integer REFERENCES "product_variants" ("id") ON DELETE SET NULL,
        "product_name" varchar(160) NOT NULL,
        "variant_label" varchar(40) NOT NULL,
        "unit_price" numeric(10,2) NOT NULL CHECK ("unit_price" >= 0),
        "quantity" integer NOT NULL CHECK ("quantity" > 0)
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_items_order" ON "order_items" ("order_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "order_status"`);
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(`DROP TABLE "product_images"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "variant_status"`);
    await queryRunner.query(`DROP TYPE "product_status"`);
    await queryRunner.query(`DROP TABLE "tea_menu_items"`);
    await queryRunner.query(`DROP TABLE "tea_categories"`);
    await queryRunner.query(`DROP TYPE "menu_item_status"`);
    await queryRunner.query(`DROP TABLE "gallery_images"`);
    await queryRunner.query(`DROP TABLE "gallery_categories"`);
  }
}
