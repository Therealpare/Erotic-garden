import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Moves the content that was hard-coded in the Angular services into the database, so
 * admins can manage it. Only owner-confirmed content is copied: the 26 real gallery
 * photos (picsum placeholders are left out), the 11 tea/coffee menu items in EN/TH/DE
 * (no images — the old ones were placeholders; tea and coffee are included in admission),
 * and the one confirmed coffee SKU: Coffee Beans 100g at 350 THB.
 * Stock is seeded at 0 because no real stock count has been confirmed — the size shows
 * SOLD OUT until an admin enters the actual number in /admin/coffee.
 */
const GALLERY_CATEGORIES: [string, string][] = [
  ['garden', 'Garden'],
  ['art', 'Art'],
  ['tea-house', 'Tea House'],
  ['people', 'People'],
];

/** [category slug, title, image url, alt text, featured, sort order] */
const GALLERY_IMAGES: [string, string, string, string, boolean, number][] = [
  [
    'garden',
    'The flowering pergola',
    'images/garden/ero1.webp',
    'A flowering pergola shading a garden seating area, with sculptures set among the lawn beyond',
    false,
    1,
  ],
  [
    'art',
    'Seated figure',
    'images/garden/ero3.webp',
    'A pale sculpture of a seated figure, viewed in profile against flowering trees',
    false,
    2,
  ],
  [
    'garden',
    'The garden pavilion',
    'images/garden/ero2.webp',
    'A garden pavilion draped in flowering orange vines, framed by tropical planting',
    true,
    4,
  ],
  [
    'art',
    'Two embracing figures',
    'images/garden/ero7.webp',
    'Garden sculpture of two embracing figures, set among palms and clipped hedges',
    false,
    6,
  ],
  [
    'tea-house',
    'Erotic Garden coffee, now stocking',
    'images/garden/cof3.webp',
    'Three bags of Erotic Garden single origin arabica coffee lined up outdoors',
    true,
    8,
  ],
  [
    'people',
    'Katai in the garden',
    'images/garden/own.webp',
    'Portrait of Katai at the garden',
    false,
    9,
  ],
  [
    'art',
    'Figural planter',
    'images/garden/ero6.webp',
    'Sculpted planter shaped like a figure, filled with trailing petunias',
    false,
    10,
  ],
  [
    'garden',
    'The seating pavilion',
    'images/garden/ero4.webp',
    'A shaded garden pavilion with seating, its curved roofline framed by bougainvillea',
    false,
    11,
  ],
  [
    'art',
    'Seated figure with a painted bloom',
    'images/garden/ero13.webp',
    'A seated sculpture with a painted sunflower motif, framed by tropical leaves',
    false,
    13,
  ],
  [
    'art',
    'Study through the leaves',
    'images/garden/ero19.webp',
    "A sculpture's form seen in close abstract detail through lotus leaves",
    false,
    14,
  ],
  [
    'art',
    'Gilded relief',
    'images/garden/ero11.webp',
    'A gilded bas-relief sculpture panel with a winged figure, mounted in the garden',
    false,
    15,
  ],
  [
    'art',
    'Carved wood, close study',
    'images/garden/ero20.webp',
    'A close detail of a carved wooden sculpture beside a garden tree',
    true,
    16,
  ],
  [
    'art',
    'The painted wall',
    'images/garden/ero21.webp',
    "A row of painted folk-art figures along the garden building's exterior wall",
    false,
    17,
  ],
  [
    'art',
    'Carved form among the palms',
    'images/garden/ero23.webp',
    'A tall carved garden sculpture in gold and copper tones, set against palms',
    false,
    18,
  ],
  [
    'art',
    'The flowering planter',
    'images/garden/ero24.webp',
    'A bent figural planter sculpture with petunias blooming from its back, on the lawn',
    false,
    19,
  ],
  [
    'art',
    'Planter in the morning light',
    'images/garden/ero25.webp',
    'The same figural planter sculpture seen from a wider angle across the lawn',
    true,
    20,
  ],
  [
    'art',
    'Garden embrace',
    'images/garden/ero26.webp',
    'A pale sculpture of two figures in embrace, seated on a garden path',
    false,
    21,
  ],
  [
    'art',
    'Reading in the hedge',
    'images/garden/ero27.webp',
    'A sculpture of a seated figure reading, framed within a clipped hedge',
    false,
    22,
  ],
  [
    'art',
    'The kiss',
    'images/garden/ero28.webp',
    'A pale sculpture of two seated figures embracing, framed by tropical leaves',
    false,
    23,
  ],
  [
    'art',
    'Seated figure with painted detail',
    'images/garden/ero29.webp',
    'A seated sculpture with a painted design along its side, before flowering shrubs',
    true,
    24,
  ],
  [
    'garden',
    'Orchid in bloom',
    'images/garden/ero30.webp',
    'A cluster of pink and white orchids in the garden, backlit by the afternoon sun',
    false,
    25,
  ],
  [
    'garden',
    'Lotus at first light',
    'images/garden/ero31.webp',
    'A large pink lotus flower in full bloom above the pond',
    false,
    26,
  ],
  [
    'garden',
    'Flowering vine, close',
    'images/garden/ero32.webp',
    'A close view of a small red trumpet-shaped flower among veined leaves',
    false,
    27,
  ],
  [
    'garden',
    'Beneath the flowering pergola',
    'images/garden/ero33.webp',
    'A pergola draped in pink blossoms, with a garden sculpture standing beneath',
    true,
    28,
  ],
  [
    'tea-house',
    'Erotic Garden coffee, red bag',
    'images/garden/cof1-3.webp',
    'A red bag of Erotic Garden single origin arabica coffee',
    false,
    29,
  ],
  [
    'tea-house',
    'Erotic Garden coffee, black bag',
    'images/garden/cof2.webp',
    'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table',
    false,
    30,
  ],
];

/** [key, display name] — Drinks is new, for non-tea/coffee beverages added later. */
const TEA_CATEGORIES: [string, string][] = [
  ['Tea', 'Tea'],
  ['Coffee', 'Coffee'],
  ['Drinks', 'Drinks'],
  ['Dessert', 'Dessert'],
  ['Special', 'Special'],
];

/** [slug, category key, name] */
const TEA_ITEMS: [string, string, { en: string; th: string; de: string }][] = [
  ['hot-tea', 'Tea', { en: 'Hot Tea', th: 'ชาร้อน', de: 'Heißer Tee' }],
  ['green-tea', 'Tea', { en: 'Green Tea', th: 'ชาเขียว', de: 'Grüner Tee' }],
  ['iced-tea', 'Tea', { en: 'Iced Tea', th: 'ชาเย็น', de: 'Eistee' }],
  ['lemon-tea', 'Tea', { en: 'Lemon Tea', th: 'ชามะนาว', de: 'Zitronentee' }],
  ['black-tea', 'Tea', { en: 'Black Tea', th: 'ชาดำ', de: 'Schwarzer Tee' }],
  [
    'americano',
    'Coffee',
    { en: 'Americano', th: 'อเมริกาโน่', de: 'Americano' },
  ],
  ['espresso', 'Coffee', { en: 'Espresso', th: 'เอสเปรสโซ', de: 'Espresso' }],
  ['latte', 'Coffee', { en: 'Latte', th: 'ลาเต้', de: 'Latte' }],
  [
    'cappuccino',
    'Coffee',
    { en: 'Cappuccino', th: 'คาปูชิโน่', de: 'Cappuccino' },
  ],
  ['mocha', 'Coffee', { en: 'Mocha', th: 'มอคค่า', de: 'Mocha' }],
  [
    'macchiato',
    'Coffee',
    { en: 'Macchiato', th: 'มัคคิอาโต้', de: 'Macchiato' },
  ],
];

export class SeedExistingCatalog1761300000001 implements MigrationInterface {
  name = 'SeedExistingCatalog1761300000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [index, [slug, name]] of GALLERY_CATEGORIES.entries()) {
      await queryRunner.query(
        `INSERT INTO "gallery_categories" ("slug", "name", "sort_order") VALUES ($1, $2, $3)`,
        [slug, name, index],
      );
    }
    for (const [
      slug,
      title,
      imageUrl,
      altText,
      featured,
      sortOrder,
    ] of GALLERY_IMAGES) {
      await queryRunner.query(
        `INSERT INTO "gallery_images" ("category_id", "title", "image_url", "alt_text", "featured", "sort_order")
         SELECT "id", $2, $3, $4, $5, $6 FROM "gallery_categories" WHERE "slug" = $1`,
        [slug, title, imageUrl, altText, featured, sortOrder],
      );
    }

    for (const [index, [key, name]] of TEA_CATEGORIES.entries()) {
      await queryRunner.query(
        `INSERT INTO "tea_categories" ("key", "name", "sort_order") VALUES ($1, $2, $3)`,
        [key, name, index],
      );
    }
    const positions: Record<string, number> = {};
    for (const [slug, categoryKey, name] of TEA_ITEMS) {
      const sortOrder = (positions[categoryKey] =
        (positions[categoryKey] ?? -1) + 1);
      await queryRunner.query(
        `INSERT INTO "tea_menu_items" ("category_id", "slug", "name", "included_in_admission", "sort_order")
         SELECT "id", $2, $3::jsonb, true, $4 FROM "tea_categories" WHERE "key" = $1`,
        [categoryKey, slug, JSON.stringify(name), sortOrder],
      );
    }

    const [product] = await queryRunner.query(
      `INSERT INTO "products" ("slug", "name") VALUES ($1, $2::jsonb) RETURNING "id"`,
      [
        'coffee-beans',
        JSON.stringify({
          en: 'Coffee Beans',
          th: 'เมล็ดกาแฟ',
          de: 'Kaffeebohnen',
        }),
      ],
    );
    const images: [string, string][] = [
      [
        'images/garden/cof2.webp',
        'A dark bag of Erotic Garden single origin arabica coffee, standing on a wooden table',
      ],
      [
        'images/garden/cof1-3.webp',
        'A red bag of Erotic Garden single origin arabica coffee',
      ],
      [
        'images/garden/cof4.webp',
        'A green bag of Erotic Garden single origin arabica coffee',
      ],
    ];
    for (const [index, [imageUrl, altText]] of images.entries()) {
      await queryRunner.query(
        `INSERT INTO "product_images" ("product_id", "image_url", "alt_text", "sort_order") VALUES ($1, $2, $3, $4)`,
        [product.id, imageUrl, altText, index],
      );
    }
    await queryRunner.query(
      `INSERT INTO "product_variants" ("product_id", "label", "price", "currency", "stock") VALUES ($1, '100g', 350, 'THB', 0)`,
      [product.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "products" WHERE "slug" = 'coffee-beans'`,
    );
    await queryRunner.query(
      `DELETE FROM "tea_menu_items" WHERE "slug" = ANY($1)`,
      [TEA_ITEMS.map(([slug]) => slug)],
    );
    await queryRunner.query(
      `DELETE FROM "tea_categories" WHERE "key" = ANY($1) AND NOT EXISTS (SELECT 1 FROM "tea_menu_items" i WHERE i."category_id" = "tea_categories"."id")`,
      [TEA_CATEGORIES.map(([key]) => key)],
    );
    await queryRunner.query(
      `DELETE FROM "gallery_images" WHERE "image_url" = ANY($1)`,
      [GALLERY_IMAGES.map(([, , url]) => url)],
    );
    await queryRunner.query(
      `DELETE FROM "gallery_categories" WHERE "slug" = ANY($1) AND NOT EXISTS (SELECT 1 FROM "gallery_images" g WHERE g."category_id" = "gallery_categories"."id")`,
      [GALLERY_CATEGORIES.map(([slug]) => slug)],
    );
  }
}
