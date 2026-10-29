/** Text stored once per site language; TH/DE fall back to EN when missing. */
export interface LocalizedText {
  en: string;
  th?: string;
  de?: string;
}
