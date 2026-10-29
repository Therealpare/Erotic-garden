import { pickLocalized } from '../pipes/localized.pipe';
import { resolveImageUrl } from './image-url.util';

describe('pickLocalized', () => {
  it('returns the requested language and falls back to English', () => {
    expect(pickLocalized({ en: 'Hot Tea', th: 'ชาร้อน' }, 'th')).toBe('ชาร้อน');
    expect(pickLocalized({ en: 'Hot Tea', th: 'ชาร้อน' }, 'de')).toBe('Hot Tea');
    expect(pickLocalized({ en: 'Hot Tea', de: '' }, 'de')).toBe('Hot Tea');
    expect(pickLocalized('plain', 'th')).toBe('plain');
    expect(pickLocalized(null, 'en')).toBe('');
  });
});

describe('resolveImageUrl', () => {
  it('points uploads at the API origin and leaves other URLs alone', () => {
    expect(resolveImageUrl('/uploads/abc.webp')).toBe('http://localhost:3000/uploads/abc.webp');
    expect(resolveImageUrl('images/garden/ero1.webp')).toBe('images/garden/ero1.webp');
    expect(resolveImageUrl('https://res.cloudinary.com/x/y.jpg')).toBe('https://res.cloudinary.com/x/y.jpg');
    expect(resolveImageUrl(null)).toBe('');
  });
});
