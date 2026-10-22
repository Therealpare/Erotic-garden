import { HttpErrorResponse } from '@angular/common/http';

/** Shared Tailwind classes so every admin form control looks the same. */
export const ADMIN_INPUT =
  'w-full border border-stone/30 bg-white px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest';
export const ADMIN_LABEL = 'mb-1 block text-xs font-medium uppercase tracking-wider text-stone';

/** Turns an API error (NestJS shape: { message: string | string[] }) into readable text. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Cannot reach the API. Check that the backend is running.';
    const message = error.error?.message;
    if (Array.isArray(message)) return message.join(' · ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}

export const STATUS_BADGE: Record<string, string> = {
  NEW: 'bg-terracotta/15 text-terracotta',
  CONTACTED: 'bg-gold/20 text-charcoal',
  QUOTED: 'bg-gold/20 text-charcoal',
  CONFIRMED: 'bg-forest/15 text-forest',
  DECLINED: 'bg-stone/15 text-stone',
  CLOSED: 'bg-stone/15 text-stone',
  PUBLISHED: 'bg-forest/15 text-forest',
  DRAFT: 'bg-stone/15 text-stone',
};
