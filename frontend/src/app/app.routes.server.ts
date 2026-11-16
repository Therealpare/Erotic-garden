import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * The live site is static (Cloudflare): every page is prerendered to HTML at build time,
 * so search engines and link previews get real content, titles and descriptions without
 * running JavaScript. Pages that depend on a URL parameter render in the browser only.
 */
export const serverRoutes: ServerRoute[] = [
  { path: 'art/:slug', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Prerender },
];
