import { API_BASE_URL } from '../../core/config/api.config';

/** Origin of the API (e.g. http://localhost:3000), where locally stored uploads are served. */
const API_ORIGIN = (() => {
  try {
    return API_BASE_URL ? new URL(API_BASE_URL).origin : '';
  } catch {
    return '';
  }
})();

/**
 * Admin uploads come back as `/uploads/…` (served by the API) or as an https URL (Cloudinary);
 * bundled site photos are `images/…`. Returns something an <img> can load from any page.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('/uploads/')) return `${API_ORIGIN}${url}`;
  return url;
}
