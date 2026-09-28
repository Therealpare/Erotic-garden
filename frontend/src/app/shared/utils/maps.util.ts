/** Builds a Google Maps "get directions" link to a specific coordinate. No API key required. */
export function buildGoogleMapsDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
