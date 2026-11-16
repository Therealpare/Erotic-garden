import { countriesFor, countryFromLocale, dialCodeOf, flagOf, internationalNumber } from './country-codes';

describe('country codes', () => {
  it('builds the number staff should dial', () => {
    expect(internationalNumber('TH', '081 234 5678')).toBe('+66 81 234 5678');
    expect(internationalNumber('IR', '912 345 6789')).toBe('+98 912 345 6789');
    expect(internationalNumber('DE', '  0151  23456789 ')).toBe('+49 151 23456789');
    expect(internationalNumber('TH', '+44 7700 900123')).toBe('+44 7700 900123');
    expect(internationalNumber('TH', '   ')).toBe('');
  });

  it('knows calling codes and flags', () => {
    expect(dialCodeOf('TH')).toBe('66');
    expect(dialCodeOf('US')).toBe('1');
    expect(dialCodeOf('ZZ')).toBeUndefined();
    expect(flagOf('th')).toBe('🇹🇭');
  });

  it('reads the country from the browser locale', () => {
    expect(countryFromLocale('de-DE')).toBe('DE');
    expect(countryFromLocale('en_GB')).toBe('GB');
    expect(countryFromLocale('th')).toBeUndefined();
    expect(countryFromLocale(undefined)).toBeUndefined();
  });

  it('lists every country once, common ones first, named in the page language', () => {
    const { common, others } = countriesFor('th');
    expect(common[0].code).toBe('TH');
    const codes = [...common, ...others].map((country) => country.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes.length).toBeGreaterThan(230);
    expect(common[0].name).toBe('ไทย');
  });
});
