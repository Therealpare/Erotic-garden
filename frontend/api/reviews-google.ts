import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Server-side proxy for the Google Places API "Place Details" endpoint (reviews field).
 * This keeps GOOGLE_PLACES_API_KEY off the client (it must never be shipped in frontend
 * bundles).
 *
 * Requires two Vercel project environment variables:
 *   GOOGLE_PLACES_API_KEY — a Google Maps Platform API key with the "Places API" enabled
 *   GOOGLE_PLACE_ID        — this business's Google Place ID
 *
 * Spec §18/§48: never fabricate, hard-code, or scrape review data. If either env var is
 * missing, or the Google API call fails, this returns an empty array (not an error) so
 * the frontend's "hide until real" logic keeps the Reviews section honest. Google's
 * Place Details endpoint returns at most 5 reviews itself; we additionally slice(0, 5)
 * defensively.
 *
 * Attribution: Google's Places API policies require "Powered by Google" attribution
 * wherever this data is shown without an accompanying Google Map — the frontend renders
 * that notice alongside these review cards. Double-check Google's current Places API
 * attribution requirements before enabling this with a real key.
 */
interface GooglePlaceReview {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
  const placeId = process.env['GOOGLE_PLACE_ID'];

  if (!apiKey || !placeId) {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json([]);
    return;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId,
    )}&fields=reviews&key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(url);
    const data = (await response.json()) as {
      status: string;
      result?: { reviews?: GooglePlaceReview[] };
    };

    if (data.status !== 'OK' || !data.result?.reviews) {
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).json([]);
      return;
    }

    const reviews = data.result.reviews.slice(0, 5).map((review, index) => ({
      id: index,
      authorName: review.author_name ?? '',
      source: 'GOOGLE' as const,
      rating: review.rating ?? 0,
      reviewText: review.text ?? '',
      reviewDate: review.relative_time_description ?? '',
      featured: true,
      status: 'PUBLISHED' as const,
    }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(reviews);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json([]);
  }
}
