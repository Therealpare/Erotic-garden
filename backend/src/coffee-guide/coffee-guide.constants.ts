/** ROAST: a roast level (light, medium, dark) · PROCESS: a processing method (washed, natural, honey). */
export type CoffeeGuideKind = 'ROAST' | 'PROCESS';
export const COFFEE_GUIDE_KINDS: CoffeeGuideKind[] = ['ROAST', 'PROCESS'];

/** ACTIVE: shown on /coffee · HIDDEN: kept for admins only. */
export type CoffeeGuideStatus = 'ACTIVE' | 'HIDDEN';
export const COFFEE_GUIDE_STATUSES: CoffeeGuideStatus[] = ['ACTIVE', 'HIDDEN'];
