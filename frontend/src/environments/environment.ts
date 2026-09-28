export const environment = {
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
};
