/** Builds a Google Maps Embed API (Place mode) URL. Requires a Maps Embed API key. */
export function buildGoogleMapsEmbedUrl(address: string, apiKey: string): string {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;
}

/** Builds a plain "open in Google Maps" directions link. No API key required. */
export function buildGoogleMapsDirectionsUrl(address: string): string {
  const query = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
