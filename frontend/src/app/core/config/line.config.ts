/**
 * The garden's LINE Official Account. Pre-orders, visit bookings, event inquiries and
 * contact messages are all sent to this chat as a pre-filled message — staff confirm
 * everything there. The basic ID is public (it is what guests search for in LINE).
 */
export const LINE_OA_ID = '@582nujvq';

/** Opens a chat with the account, with `text` already typed in for the guest to send. */
export function lineMessageUrl(text: string): string {
  return `https://line.me/R/oaMessage/${encodeURIComponent(LINE_OA_ID)}/?${encodeURIComponent(text)}`;
}

/** Adds the account as a friend (shows a QR code on desktop). */
export const LINE_ADD_FRIEND_URL = `https://line.me/R/ti/p/${encodeURIComponent(LINE_OA_ID)}`;

/** Opens LINE in a new tab; returns false if the browser blocked it (the page then shows a link). */
export function openLine(url: string): boolean {
  // Not passing "noopener" as a feature: it makes window.open always return null.
  const opened = window.open(url, '_blank');
  if (opened) opened.opener = null;
  return opened !== null;
}
