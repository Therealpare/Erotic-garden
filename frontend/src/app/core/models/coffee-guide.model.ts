import { LocalizedText } from './localized-text.model';

export type CoffeeGuideKind = 'ROAST' | 'PROCESS';
export type CoffeeGuideStatus = 'ACTIVE' | 'HIDDEN';

/** A roast level (light / medium / dark) or processing method (washed / natural / honey). */
export interface CoffeeGuideEntry {
  id: number;
  kind: CoffeeGuideKind;
  /** Stable id the page uses to link each coffee to its roast and process. */
  key: string;
  name: LocalizedText;
  /** Roast: what the beans look like · Process: how it is done. */
  summary: Partial<LocalizedText>;
  flavor: Partial<LocalizedText>;
  /** Roast only: brewing methods it suits. */
  brewing: Partial<LocalizedText>;
  imageUrl: string | null;
  imageAlt: string | null;
  sortOrder: number;
}

export interface CoffeeGuide {
  roastLevels: CoffeeGuideEntry[];
  processes: CoffeeGuideEntry[];
}

export interface AdminCoffeeGuideEntry extends CoffeeGuideEntry {
  status: CoffeeGuideStatus;
  updatedAt: string;
}

export type CoffeeGuideEntryInput = Partial<
  Pick<AdminCoffeeGuideEntry, 'name' | 'summary' | 'flavor' | 'brewing' | 'imageUrl' | 'imageAlt' | 'status' | 'sortOrder'>
>;
