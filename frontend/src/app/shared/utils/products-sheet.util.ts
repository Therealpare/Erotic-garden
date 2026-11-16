import { Product, ProductImage, ProductVariant } from '../../core/models/product.model';

/**
 * Turns the rows of the products Google Sheet (see /docs/products-sheet.csv) into
 * products. One row per size; rows with the same `product` id belong together, and the
 * first non-empty value of a product field (name, origin, roast…) is used.
 *
 * Columns: product, name_en, name_th, name_de, size, price, available, image, image_alt,
 * origin, process, altitude, roast, notes, body, description_en, description_th, description_de
 *
 * - price: a number ("350", "1,200", "฿350"); empty → shown as "price on request".
 * - available: yes/no (also true/false, 1/0, มี/หมด); empty → yes.
 * - image: an https:// address or a site path such as images/coffee/x.webp; one or more rows.
 */

/** Pre-orders are confirmed on LINE, so no live stock: a size can be added up to this many times. */
export const MAX_PER_ITEM = 20;

const NO = /^(no|n|false|0|หมด|ไม่มี|sold\s*out|ausverkauft)$/i;
const SAFE_IMAGE = /^(https:\/\/[^\s"'<>]+|images\/[\w./-]+)$/;

/** Stable small integer for a text key, so cart lines survive the sheet being re-ordered. */
export function stableId(key: string): number {
  let hash = 0;
  for (const char of key) hash = (Math.imul(hash, 31) + char.codePointAt(0)!) | 0;
  return (hash >>> 1) || 1;
}

export function parsePrice(value: string | undefined): number | null {
  const cleaned = (value ?? '').replace(/[,\s฿]|thb|baht|บาท/gi, '');
  if (!cleaned) return null;
  const price = Number(cleaned);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function productsFromSheet(rows: Record<string, string>[]): Product[] {
  const groups = new Map<string, Record<string, string>[]>();
  for (const row of rows) {
    const slug = (row['product'] ?? '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug) continue;
    groups.set(slug, [...(groups.get(slug) ?? []), row]);
  }

  const products: Product[] = [];
  for (const [slug, group] of groups) {
    const first = (column: string): string => group.map((row) => row[column] ?? '').find((value) => value !== '') ?? '';
    const nameEn = first('name_en');
    if (!nameEn) continue;

    const images: ProductImage[] = [];
    for (const row of group) {
      const url = row['image'] ?? '';
      if (SAFE_IMAGE.test(url) && !url.includes('..') && !images.some((image) => image.imageUrl === url)) {
        images.push({ imageUrl: url, altText: row['image_alt'] || nameEn, sortOrder: images.length });
      }
    }

    const variants: ProductVariant[] = group
      .filter((row) => row['size'])
      .map((row) => {
        const available = !NO.test(row['available'] ?? '');
        return {
          id: stableId(`${slug}|${row['size']}`),
          label: row['size'],
          price: parsePrice(row['price']),
          currency: 'THB',
          stock: available ? MAX_PER_ITEM : 0,
          soldOut: !available,
        };
      });

    products.push({
      id: stableId(slug),
      slug,
      name: { en: nameEn, th: first('name_th') || undefined, de: first('name_de') || undefined },
      description: { en: first('description_en') || undefined, th: first('description_th') || undefined, de: first('description_de') || undefined },
      origin: first('origin') || null,
      process: first('process') || null,
      altitude: first('altitude') || null,
      roastLevel: first('roast') || null,
      tastingNotes: first('notes') || null,
      body: first('body') || null,
      images,
      variants,
    });
  }
  return products;
}
