export const environment = {
  /**
   * Local NestJS API (`npm run start:dev` in /backend).
   */
  apiBaseUrl: 'http://localhost:3000/api/v1',
  /** Public address used for canonical links and social previews ('' = current origin). */
  siteUrl: '',
  production: false,
  /**
   * >>> PUT YOUR GOOGLE MAPS EMBED API KEY HERE <<<
   * 1. Go to https://console.cloud.google.com/google/maps-apis/credentials
   * 2. Enable the "Maps Embed API" for your project.
   * 3. Create an API key and restrict it to your domain(s) (HTTP referrer restriction).
   * 4. Paste the key below. Never commit a real key to a public repository —
   *    for CI/CD, inject it at build time instead (e.g. replace this file or use a build script).
   */
  googleMapsApiKey: '',
  /**
   * Products Google Sheet published as CSV (File → Share → Publish to web → CSV), so the
   * owner can change products, sizes, prices and availability without a deploy. Used when
   * there is no API; while empty, or if the sheet can't be read, the site uses the
   * snapshot in public/data/products.csv.
   */
  productsSheetUrl: '',
};
