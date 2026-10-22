const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtube-nocookie.com',
]);
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extracts the 11-character video id from any common YouTube URL shape
 * (watch?v=, youtu.be/, /shorts/, /embed/, /live/). Returns null for non-YouTube URLs.
 */
export function extractYoutubeId(rawUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (!YOUTUBE_HOSTS.has(url.hostname)) return null;

  const candidate =
    url.hostname === 'youtu.be'
      ? url.pathname.slice(1)
      : (url.searchParams.get('v') ??
        url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?#]+)/)?.[1]);

  return candidate && VIDEO_ID.test(candidate) ? candidate : null;
}
