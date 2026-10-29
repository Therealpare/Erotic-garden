/**
 * Reads the free-text roast and process an admin copied from a bag's label
 * ("Light-Medium", "Medium Dark", "Honey", or the Thai/German words) and maps them onto
 * the five-step roast scale and the processing-method explainers on the Coffee page.
 * Text that doesn't match is still shown as written — it just isn't linked.
 */
export const ROAST_STEPS = 5;

const LIGHT = /light|hell|อ่อน/;
const MEDIUM = /medium|mittel|กลาง/;
const DARK = /dark|dunkel|เข้ม/;

/** 0 light · 1 light-medium · 2 medium · 3 medium-dark · 4 dark · null when not recognised. */
export function roastStep(roastLevel: string | null | undefined): number | null {
  const text = (roastLevel ?? '').toLowerCase();
  const light = LIGHT.test(text);
  const medium = MEDIUM.test(text);
  const dark = DARK.test(text);
  if (light && dark) return null;
  if (light) return medium ? 1 : 0;
  if (dark) return medium ? 3 : 4;
  return medium ? 2 : null;
}

/** Roast-level guide keys a step belongs to, e.g. light-medium → light and medium. */
export function roastKeys(step: number | null): string[] {
  if (step === null) return [];
  return [['light'], ['light', 'medium'], ['medium'], ['medium', 'dark'], ['dark']][step];
}

/** "washed" | "natural" | "honey" | null. Honey is checked first ("black honey", "honey washed"). */
export function processKey(process: string | null | undefined): string | null {
  const text = (process ?? '').toLowerCase();
  if (/honey|ฮันนี่|น้ำผึ้ง/.test(text)) return 'honey';
  if (/natural|dry|natur|trocken|แห้ง/.test(text)) return 'natural';
  if (/wash|gewaschen|เปียก/.test(text)) return 'washed';
  return null;
}
