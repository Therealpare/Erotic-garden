/** AVAILABLE: shown and orderable · SOLD_OUT: shown, marked unavailable today · HIDDEN: not shown on the site. */
export type MenuItemStatus = 'AVAILABLE' | 'SOLD_OUT' | 'HIDDEN';
export const MENU_ITEM_STATUSES: MenuItemStatus[] = [
  'AVAILABLE',
  'SOLD_OUT',
  'HIDDEN',
];
