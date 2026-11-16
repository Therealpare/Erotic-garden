/** Calling codes for the phone field's country picker. */

export interface Country {
  /** ISO 3166-1 alpha-2, e.g. "TH". */
  code: string;
  /** Calling code without "+", e.g. "66". */
  dial: string;
  /** Country name in the page language. */
  name: string;
  flag: string;
}

/** ISO code + calling code. Shared codes (+1, +7, +44…) are listed under each country. */
const DIAL_CODES =
  'AF93 AX358 AL355 DZ213 AS1684 AD376 AO244 AI1264 AG1268 AR54 AM374 AW297 AU61 AT43 AZ994 BS1242 BH973 BD880 ' +
  'BB1246 BY375 BE32 BZ501 BJ229 BM1441 BT975 BO591 BA387 BW267 BR55 IO246 VG1284 BN673 BG359 BF226 BI257 KH855 ' +
  'CM237 CA1 CV238 KY1345 CF236 TD235 CL56 CN86 CO57 KM269 CG242 CD243 CK682 CR506 CI225 HR385 CU53 CW599 CY357 ' +
  'CZ420 DK45 DJ253 DM1767 DO1809 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FK500 FO298 FJ679 FI358 FR33 ' +
  'GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1473 GP590 GU1671 GT502 GG44 GN224 GW245 GY592 ' +
  'HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1876 JP81 JE44 JO962 KZ7 KE254 ' +
  'KI686 XK383 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ' +
  'ML223 MT356 MH692 MQ596 MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 ME382 MS1664 MA212 MZ258 MM95 NA264 ' +
  'NR674 NP977 NL31 NC687 NZ64 NI505 NE227 NG234 NU683 KP850 MK389 MP1670 NO47 OM968 PK92 PW680 PS970 PA507 ' +
  'PG675 PY595 PE51 PH63 PL48 PT351 PR1787 QA974 RE262 RO40 RU7 RW250 BL590 SH290 KN1869 LC1758 MF590 PM508 ' +
  'VC1784 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SX1721 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ' +
  'ES34 LK94 SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TK690 TO676 TT1868 TN216 TR90 TM993 ' +
  'TC1649 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VI1340 VU678 VA39 VE58 VN84 WF681 EH212 YE967 ZM260 ZW263';

/** Shown first: where most of the garden's visitors come from. */
const COMMON = ['TH', 'CN', 'US', 'GB', 'DE', 'FR', 'AU', 'IN', 'JP', 'KR', 'MY', 'SG', 'RU'];

export const DEFAULT_COUNTRY = 'TH';

/** 🇹🇭 from "TH" (regional indicator letters). */
export function flagOf(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65));
}

function regionNames(lang: string): (code: string) => string {
  try {
    const names = new Intl.DisplayNames([lang, 'en'], { type: 'region' });
    return (code) => names.of(code) ?? code;
  } catch {
    return (code) => code;
  }
}

/** All countries with names in `lang`: common ones first, then the rest A–Z. */
export function countriesFor(lang: string): { common: Country[]; others: Country[] } {
  const name = regionNames(lang);
  const all = DIAL_CODES.split(' ').map((entry) => {
    const code = entry.slice(0, 2);
    return { code, dial: entry.slice(2), name: name(code), flag: flagOf(code) };
  });
  const byCode = new Map(all.map((country) => [country.code, country]));
  return {
    common: COMMON.map((code) => byCode.get(code)!),
    others: all.filter((country) => !COMMON.includes(country.code)).sort((a, b) => a.name.localeCompare(b.name, lang)),
  };
}

export function dialCodeOf(code: string): string | undefined {
  return DIAL_CODES.split(' ').find((entry) => entry.slice(0, 2) === code)?.slice(2);
}

/** The browser's region (e.g. "de-DE" → "DE") when it is in the list. */
export function countryFromLocale(locale: string | undefined): string | undefined {
  const region = locale?.match(/[-_]([A-Z]{2})\b/i)?.[1]?.toUpperCase();
  return region && dialCodeOf(region) ? region : undefined;
}

/**
 * The number as staff should dial it: "+66 81 234 5678". A leading 0 (trunk prefix) is
 * dropped; a number typed with its own "+" is kept as typed.
 */
export function internationalNumber(countryCode: string, local: string): string {
  const number = local.trim().replace(/\s+/g, ' ');
  if (!number) return '';
  if (number.startsWith('+')) return number;
  const dial = dialCodeOf(countryCode) ?? dialCodeOf(DEFAULT_COUNTRY)!;
  return `+${dial} ${number.replace(/^0+/, '')}`;
}
