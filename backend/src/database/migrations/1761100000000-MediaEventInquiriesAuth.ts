import { MigrationInterface, QueryRunner } from 'typeorm';

/** Phase 5 start: admin users (spec §35), media library, and event inquiries. */
export class MediaEventInquiriesAuth1761100000000 implements MigrationInterface {
  name = 'MediaEventInquiriesAuth1761100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "user_role" AS ENUM ('ADMIN', 'EDITOR')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar(120) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "role" "user_role" NOT NULL DEFAULT 'EDITOR',
        "refresh_token_hash" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_users_email_lower" ON "users" (LOWER("email"))`,
    );

    await queryRunner.query(
      `CREATE TYPE "media_type" AS ENUM ('VIDEO', 'ARTICLE', 'MAGAZINE', 'TV', 'REEL')`,
    );
    await queryRunner.query(
      `CREATE TYPE "media_status" AS ENUM ('DRAFT', 'PUBLISHED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "media_items" (
        "id" SERIAL PRIMARY KEY,
        "type" "media_type" NOT NULL,
        "title" varchar(200) NOT NULL,
        "source" varchar(120) NOT NULL,
        "url" varchar(500) NOT NULL,
        "youtube_video_id" varchar(11),
        "thumbnail_url" varchar(500),
        "summary" text,
        "published_at" date,
        "is_featured" boolean NOT NULL DEFAULT false,
        "status" "media_status" NOT NULL DEFAULT 'DRAFT',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_media_items_status_type" ON "media_items" ("status", "type")`,
    );

    await queryRunner.query(
      `CREATE TYPE "event_type" AS ENUM ('WEDDING', 'PRIVATE_PARTY', 'CORPORATE', 'PHOTOSHOOT', 'WORKSHOP', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "contact_preference" AS ENUM ('EMAIL', 'PHONE', 'LINE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "inquiry_status" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'DECLINED', 'CLOSED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "event_inquiries" (
        "id" SERIAL PRIMARY KEY,
        "reference_code" varchar(16) NOT NULL UNIQUE,
        "name" varchar(120) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(40) NOT NULL,
        "organization" varchar(160),
        "event_type" "event_type" NOT NULL,
        "preferred_date" date NOT NULL,
        "flexible_date" boolean NOT NULL DEFAULT false,
        "guest_count" integer NOT NULL CHECK ("guest_count" > 0),
        "contact_preference" "contact_preference" NOT NULL DEFAULT 'EMAIL',
        "line_id" varchar(60),
        "message" text NOT NULL,
        "status" "inquiry_status" NOT NULL DEFAULT 'NEW',
        "admin_notes" text,
        "line_notified_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_event_inquiries_status_created" ON "event_inquiries" ("status", "created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_inquiries"`);
    await queryRunner.query(`DROP TYPE "inquiry_status"`);
    await queryRunner.query(`DROP TYPE "contact_preference"`);
    await queryRunner.query(`DROP TYPE "event_type"`);
    await queryRunner.query(`DROP TABLE "media_items"`);
    await queryRunner.query(`DROP TYPE "media_status"`);
    await queryRunner.query(`DROP TYPE "media_type"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_role"`);
  }
}
