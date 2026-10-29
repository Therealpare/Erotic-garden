import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/** Text stored once per site language (EN required; TH/DE fall back to EN when empty). */
export interface LocalizedText {
  en: string;
  th?: string;
  de?: string;
}

export class LocalizedNameDto implements LocalizedText {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  en: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  th?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  de?: string;
}

export class LocalizedDescriptionDto implements Partial<LocalizedText> {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  th?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  de?: string;
}

/** Drops empty translations so the stored JSON only holds real text. */
export function cleanLocalized<T extends Partial<LocalizedText>>(
  value: T | undefined | null,
): T {
  const out: Partial<LocalizedText> = {};
  for (const lang of ['en', 'th', 'de'] as const) {
    const text = value?.[lang]?.trim();
    if (text) out[lang] = text;
  }
  return out as T;
}
