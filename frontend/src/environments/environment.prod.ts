export const environment = {
  /**
   * Public URL of the deployed NestJS API, e.g. 'https://api.example.com/api/v1'.
   * While empty, API-backed features degrade gracefully: media sections stay hidden and
   * the event inquiry form points visitors to the Contact page instead.
   */
  apiBaseUrl: '',
  production: true,
  /**
   * >>> PUT YOUR PRODUCTION GOOGLE MAPS EMBED API KEY HERE <<<
   * Use a key restricted to your production domain. See environment.ts for setup steps.
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
