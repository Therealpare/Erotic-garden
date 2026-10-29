import { MigrationInterface, QueryRunner } from 'typeorm';

type Text = { en: string; th: string; de: string };

/**
 * Coffee page content, editable in /admin/coffee-guide and /admin/coffee:
 *
 * 1. `coffee_guide_entries` — general explainers for the three roast levels and three
 *    processing methods (EN/TH/DE). They describe roasts/processes in general, not a
 *    specific bag.
 * 2. `products.altitude` / `products.body` — two label fields the bags print but the
 *    product table could not hold yet.
 * 3. The three bags in the owner's photos (pictures/cof/IMG_8063–8065), with origin,
 *    process, altitude, roast, notes and body copied from each printed label. They are
 *    added without sizes or prices — none have been confirmed for them — so they show in
 *    the "Our coffees" section but not in the shop until an admin adds sizes.
 *    The existing "Coffee Beans" product, its 100g price and stock are left untouched.
 */
const GUIDE: {
  kind: 'ROAST' | 'PROCESS';
  key: string;
  name: Text;
  summary: Text;
  flavor: Text;
  brewing?: Text;
}[] = [
  {
    kind: 'ROAST',
    key: 'light',
    name: { en: 'Light Roast', th: 'คั่วอ่อน', de: 'Helle Röstung' },
    summary: {
      en: 'Light brown beans with a dry surface and no oily sheen.',
      th: 'เมล็ดสีน้ำตาลอ่อน ผิวแห้ง ไม่มีน้ำมันเคลือบ',
      de: 'Hellbraune Bohnen mit trockener Oberfläche, ganz ohne Ölglanz.',
    },
    flavor: {
      en: 'Bright, lively acidity with fruity or floral notes, a light body and little bitterness.',
      th: 'เปรี้ยวสดใส โทนผลไม้หรือดอกไม้ Body เบา ขมน้อย',
      de: 'Frische, lebendige Säure mit fruchtigen oder blumigen Noten, leichter Körper und kaum Bitterkeit.',
    },
    brewing: {
      en: 'Drip, pour-over, cold brew and slow bar.',
      th: 'Drip, Pour-over, Cold Brew และ Slow Bar',
      de: 'Filterkaffee, Pour-over, Cold Brew und Slow Bar.',
    },
  },
  {
    kind: 'ROAST',
    key: 'medium',
    name: { en: 'Medium Roast', th: 'คั่วกลาง', de: 'Mittlere Röstung' },
    summary: {
      en: 'Deeper brown beans with a dry surface or just a little oil.',
      th: 'เมล็ดสีน้ำตาลเข้มขึ้น ผิวแห้งหรือมีน้ำมันเล็กน้อย',
      de: 'Dunklere braune Bohnen, trocken oder mit nur wenig Öl auf der Oberfläche.',
    },
    flavor: {
      en: 'A balance of acidity and bitterness, with nutty, caramel or chocolate notes.',
      th: 'สมดุลระหว่างความเปรี้ยวและความขม โทนถั่ว คาราเมล หรือช็อกโกแลต',
      de: 'Ausgewogen zwischen Säure und Bitterkeit, mit Noten von Nüssen, Karamell oder Schokolade.',
    },
    brewing: {
      en: 'Americano, cappuccino, latte, and coffee served hot or iced.',
      th: 'Americano, Cappuccino, Latte และกาแฟร้อนหรือเย็น',
      de: 'Americano, Cappuccino, Latte sowie Kaffee heiß oder auf Eis.',
    },
  },
  {
    kind: 'ROAST',
    key: 'dark',
    name: { en: 'Dark Roast', th: 'คั่วเข้ม', de: 'Dunkle Röstung' },
    summary: {
      en: 'Dark brown to almost black beans, often with oil on the surface.',
      th: 'เมล็ดสีน้ำตาลเข้มถึงเกือบดำ อาจมีน้ำมันบนผิว',
      de: 'Dunkelbraune bis fast schwarze Bohnen, oft mit Öl auf der Oberfläche.',
    },
    flavor: {
      en: 'Bold and intense, with a heavy body, pronounced bitterness and sometimes roasty or smoky notes.',
      th: 'เข้มข้น Body หนัก ความขมเด่น และอาจมีกลิ่นคั่วหรือ Smoky',
      de: 'Kräftig und intensiv, mit vollem Körper, ausgeprägter Bitterkeit und mitunter röstigen oder rauchigen Noten.',
    },
    brewing: {
      en: 'Espresso, mocha, and iced coffee with milk or other mixers.',
      th: 'Espresso, Mocha และกาแฟเย็นที่ผสมนมหรือส่วนผสมอื่น',
      de: 'Espresso, Mokka und Eiskaffee mit Milch oder anderen Zutaten.',
    },
  },
  {
    kind: 'PROCESS',
    key: 'washed',
    name: {
      en: 'Washed Process',
      th: 'กระบวนการเปียก',
      de: 'Gewaschene Aufbereitung',
    },
    summary: {
      en: 'The skin and fruit are taken off the coffee cherry, the sticky layer is washed away, and the beans are dried.',
      th: 'ลอกเปลือกและเนื้อผลกาแฟออก แล้วกำจัดเมือกและตากเมล็ดให้แห้ง',
      de: 'Haut und Fruchtfleisch der Kaffeekirsche werden entfernt, die klebrige Schicht wird abgewaschen und die Bohnen werden getrocknet.',
    },
    flavor: {
      en: 'Usually a clean cup with clear acidity, sometimes with floral or fruity notes.',
      th: 'โดยทั่วไปให้รสชาติสะอาด Acidity ชัดเจน และอาจมีโทนดอกไม้หรือผลไม้',
      de: 'Meist eine klare, saubere Tasse mit deutlicher Säure, mitunter mit blumigen oder fruchtigen Noten.',
    },
  },
  {
    kind: 'PROCESS',
    key: 'natural',
    name: {
      en: 'Natural / Dry Process',
      th: 'กระบวนการแห้ง',
      de: 'Natürliche / trockene Aufbereitung',
    },
    summary: {
      en: 'The whole coffee cherry is dried first; the dried skin and fruit are removed afterwards.',
      th: 'ตากผลกาแฟทั้งลูกก่อนนำไปสีเอาเปลือกและเนื้อแห้งออก',
      de: 'Die ganze Kaffeekirsche wird zuerst getrocknet; erst danach werden die getrocknete Haut und das Fruchtfleisch entfernt.',
    },
    flavor: {
      en: 'Often sweeter, with more body and notes of ripe fruit or berries.',
      th: 'โดยทั่วไปอาจให้ความหวานและ Body มากขึ้น พร้อมโทนผลไม้สุกหรือเบอร์รี่',
      de: 'Oft süßer, mit mehr Körper und Noten von reifen Früchten oder Beeren.',
    },
  },
  {
    kind: 'PROCESS',
    key: 'honey',
    name: {
      en: 'Honey Process',
      th: 'กระบวนการฮันนี่',
      de: 'Honey-Aufbereitung',
    },
    summary: {
      en: 'The skin is taken off, but part of the sticky fruit layer stays on the beans while they dry.',
      th: 'ลอกเปลือกผลกาแฟออก แต่คงเมือกบางส่วนไว้ขณะตากแห้ง',
      de: 'Die Haut wird entfernt, ein Teil der klebrigen Fruchtschicht bleibt beim Trocknen jedoch an den Bohnen.',
    },
    flavor: {
      en: 'Usually a balance of sweetness and acidity, with a medium to full body.',
      th: 'โดยทั่วไปให้ความสมดุลระหว่างความหวานและความเปรี้ยว พร้อม Body ระดับกลางถึงสูง',
      de: 'Meist ausgewogen zwischen Süße und Säure, mit mittlerem bis vollem Körper.',
    },
  },
];

/** Exactly as printed on each bag's label ("LAMON" on the yellow bag is written as "lemon"). */
const BEANS: {
  slug: string;
  name: Text;
  origin: string;
  process: string;
  altitude: string;
  roastLevel: string;
  tastingNotes: string;
  body: string;
  imageUrl: string;
  altText: string;
}[] = [
  {
    slug: 'khun-chang-khian-honey',
    name: {
      en: 'Khun Chang Khian',
      th: 'ขุนช่างเคี่ยน',
      de: 'Khun Chang Khian',
    },
    origin: 'Khun Chang Khian',
    process: 'Honey',
    altitude: '1,200 – 1,400 MASL',
    roastLevel: 'Light',
    tastingNotes: 'White floral, lemon, apple, honey',
    body: 'Smooth body',
    imageUrl: 'images/coffee/khun-chang-khian-honey.webp',
    altText:
      'Yellow bag of Erotic Garden single origin coffee from Khun Chang Khian, honey process, light roast',
  },
  {
    slug: 'pangkhum-natural',
    name: { en: 'Pangkhum', th: 'ปางขุม', de: 'Pangkhum' },
    origin: 'Pangkhum',
    process: 'Natural',
    altitude: '1,400 MASL',
    roastLevel: 'Light-Medium',
    tastingNotes: 'Berry, floral, rosé wine, stone fruit, chocolate',
    body: 'Full body',
    imageUrl: 'images/coffee/pangkhum-natural.webp',
    altText:
      'Red bag of Erotic Garden single origin coffee from Pangkhum, natural process, light-medium roast',
  },
  {
    slug: 'mae-poon-luang-washed',
    name: { en: 'Mae Poon Luang', th: 'แม่พูนหลวง', de: 'Mae Poon Luang' },
    origin: 'Mae Poon Luang',
    process: 'Washed',
    altitude: '1,300 MASL',
    roastLevel: 'Medium-Dark',
    tastingNotes: 'White flowers, honey, oolong tea',
    body: 'Full body',
    imageUrl: 'images/coffee/mae-poon-luang-washed.webp',
    altText:
      'Blue bag of Erotic Garden single origin coffee from Mae Poon Luang, washed process, medium-dark roast',
  },
];

export class CoffeeGuideAndBeanProfiles1761400000000 implements MigrationInterface {
  name = 'CoffeeGuideAndBeanProfiles1761400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "coffee_guide_kind" AS ENUM ('ROAST', 'PROCESS')`,
    );
    await queryRunner.query(
      `CREATE TYPE "coffee_guide_status" AS ENUM ('ACTIVE', 'HIDDEN')`,
    );
    await queryRunner.query(`
      CREATE TABLE "coffee_guide_entries" (
        "id" SERIAL PRIMARY KEY,
        "kind" "coffee_guide_kind" NOT NULL,
        "key" varchar(40) NOT NULL,
        "name" jsonb NOT NULL,
        "summary" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "flavor" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "brewing" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "image_url" varchar(500),
        "image_alt" varchar(300),
        "status" "coffee_guide_status" NOT NULL DEFAULT 'ACTIVE',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_coffee_guide_kind_key" UNIQUE ("kind", "key")
      )`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "altitude" varchar(80), ADD "body" varchar(80)`,
    );

    for (const [index, entry] of GUIDE.entries()) {
      await queryRunner.query(
        `INSERT INTO "coffee_guide_entries" ("kind", "key", "name", "summary", "flavor", "brewing", "sort_order")
         VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7)`,
        [
          entry.kind,
          entry.key,
          JSON.stringify(entry.name),
          JSON.stringify(entry.summary),
          JSON.stringify(entry.flavor),
          JSON.stringify(entry.brewing ?? {}),
          index % 3,
        ],
      );
    }

    for (const [index, bean] of BEANS.entries()) {
      const rows: { id: number }[] = await queryRunner.query(
        `INSERT INTO "products" ("slug", "name", "origin", "process", "altitude", "roast_level", "tasting_notes", "body", "sort_order")
         VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT ("slug") DO NOTHING RETURNING "id"`,
        [
          bean.slug,
          JSON.stringify(bean.name),
          bean.origin,
          bean.process,
          bean.altitude,
          bean.roastLevel,
          bean.tastingNotes,
          bean.body,
          index + 1,
        ],
      );
      if (!rows.length) continue; // an admin already created a product with this slug
      await queryRunner.query(
        `INSERT INTO "product_images" ("product_id", "image_url", "alt_text", "sort_order") VALUES ($1, $2, $3, 0)`,
        [rows[0].id, bean.imageUrl, bean.altText],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only removes the seeded bags while they still have no sizes (i.e. nothing was sold).
    await queryRunner.query(
      `DELETE FROM "products" p WHERE p."slug" = ANY($1)
         AND NOT EXISTS (SELECT 1 FROM "product_variants" v WHERE v."product_id" = p."id")`,
      [BEANS.map((bean) => bean.slug)],
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "body", DROP COLUMN "altitude"`,
    );
    await queryRunner.query(`DROP TABLE "coffee_guide_entries"`);
    await queryRunner.query(`DROP TYPE "coffee_guide_status"`);
    await queryRunner.query(`DROP TYPE "coffee_guide_kind"`);
  }
}
