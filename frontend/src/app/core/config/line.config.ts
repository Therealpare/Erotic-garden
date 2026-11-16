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

/** Phones and tablets, where line.me links should hand over to the LINE app. */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false; // prerendering at build time
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;
}

/** `target` for "Open LINE" links: same tab on phones (see openLine), a new tab on desktop. */
export function lineLinkTarget(): '_blank' | null {
  return isMobileDevice() ? null : '_blank';
}

/**
 * Opens the LINE chat. On phones the link is followed in the same tab: a new tab
 * (window.open) often fails to hand over to the LINE app — especially in in-app browsers
 * (LINE, Facebook, Instagram) — and lands on the line.me homepage instead. On desktop a
 * new tab keeps the site open next to LINE's QR page. Returns false if a popup was
 * blocked (the page always shows an "Open LINE again" link as well).
 */
export function openLine(url: string): boolean {
  if (isMobileDevice()) {
    window.location.assign(url);
    return true;
  }
  // Not passing "noopener" as a feature: it makes window.open always return null.
  const opened = window.open(url, '_blank');
  if (opened) opened.opener = null;
  return opened !== null;
}
