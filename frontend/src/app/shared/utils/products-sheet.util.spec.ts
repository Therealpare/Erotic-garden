import { parseCsv } from './csv.util';
import { MAX_PER_ITEM, parsePrice, productsFromSheet, stableId } from './products-sheet.util';
import { composeLineMessage, formatVisitDate } from './line-message.util';
import { lineMessageUrl } from '../../core/config/line.config';

const SHEET = [
  'product,name_en,name_th,size,price,available,image,image_alt,roast,notes',
  'pangkhum,Pangkhum,ปางขุม,100g,350,yes,images/coffee/p.webp,Red bag,Light-Medium,"Berry, floral, ""rosé"""',
  'pangkhum,,,200g,,yes,,,,',
  'pangkhum,,,500g,"1,500",หมด,javascript:alert(1),,,',
  'no-name,,,100g,100,yes,,,,',
  ',Orphan,,100g,100,yes,,,,',
].join('\r\n');

describe('products sheet', () => {
  it('parses quoted fields, escaped quotes and CRLF line ends', () => {
    const rows = parseCsv(SHEET);
    expect(rows.length).toBe(5);
    expect(rows[0]['notes']).toBe('Berry, floral, "rosé"');
    expect(rows[2]['price']).toBe('1,500');
  });

  it('groups sizes per product and reads price and availability', () => {
    const [pangkhum, ...rest] = productsFromSheet(parseCsv(SHEET));
    expect(rest.length).toBe(0); // rows without a product id or English name are skipped
    expect(pangkhum.name).toEqual({ en: 'Pangkhum', th: 'ปางขุม', de: undefined });
    expect(pangkhum.roastLevel).toBe('Light-Medium');
    expect(pangkhum.variants.map((v) => [v.label, v.price, v.soldOut, v.stock])).toEqual([
      ['100g', 350, false, MAX_PER_ITEM],
      ['200g', null, false, MAX_PER_ITEM],
      ['500g', 1500, true, 0],
    ]);
  });

  it('only accepts https or site image paths', () => {
    const [pangkhum] = productsFromSheet(parseCsv(SHEET));
    expect(pangkhum.images.map((image) => image.imageUrl)).toEqual(['images/coffee/p.webp']);
  });

  it('keeps ids stable whatever the row order', () => {
    expect(stableId('pangkhum|100g')).toBe(stableId('pangkhum|100g'));
    expect(stableId('pangkhum|100g')).not.toBe(stableId('pangkhum|200g'));
    expect(parsePrice('฿ 1,200 บาท')).toBe(1200);
    expect(parsePrice('ask')).toBeNull();
  });

  it('builds a LINE link with the message typed in', () => {
    const text = composeLineMessage('Pre-order', [
      ['Name', 'Ann'],
      ['Phone', ''],
      ['Visit date', formatVisitDate('2026-12-20', 'en')],
    ], ['• Pangkhum 100g × 1 — ฿350']);
    expect(text).toBe('🌿 Erotic Garden — Pre-order\nName: Ann\nVisit date: 20 Dec 2026\n• Pangkhum 100g × 1 — ฿350');
    const url = lineMessageUrl(text);
    expect(url.startsWith('https://line.me/R/oaMessage/%40582nujvq/?')).toBeTrue();
    expect(decodeURIComponent(url.split('/?')[1])).toBe(text);
  });
});
