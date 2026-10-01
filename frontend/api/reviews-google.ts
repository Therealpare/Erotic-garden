import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Server-side proxy for the Google Places API "Place Details" endpoint. This keeps
 * GOOGLE_PLACES_API_KEY off the client (it must never be shipped in frontend bundles).
 *
 * Requires two Vercel project environment variables:
 *   GOOGLE_PLACES_API_KEY — a Google Maps Platform API key with the "Places API" enabled
 *   GOOGLE_PLACE_ID        — this business's Google Place ID
 *
 * Spec §18/§48: never fabricate or scrape review data. If either env var is missing, or
 * the Google API call fails, this returns zeroed/empty values (not an error) so the
 * frontend's existing "hide until real" logic keeps the Reviews section honest.
 */
const EMPTY_RESULT = { averageRating: 0, totalReviews: 0, profileUrl: '' };

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(EMPTY_RESULT);
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=rating,user_ratings_total,url&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    const data = (await response.json()) as {
      status: string;
      result?: { rating?: number; user_ratings_total?: number; url?: string };
    };

    if (data.status !== 'OK' || !data.result) {
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json(EMPTY_RESULT);
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({
      averageRating: data.result.rating ?? 0,
      totalReviews: data.result.user_ratings_total ?? 0,
      profileUrl: data.result.url ?? '',
    });
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(EMPTY_RESULT);
  }
}
