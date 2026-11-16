import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Link-preview image (LINE, Facebook, Google): 1200×630, in public/images. */
const SHARE_IMAGE = 'images/og-cover.jpg';

export const DEFAULT_DESCRIPTION =
  'A Garden Beyond Imagination — where art, nature and human expression meet in the hills of Chiang Mai, Thailand.';

/**
 * Keeps per-page SEO tags in sync with the active route (spec §45): meta description,
 * Open Graph title/description/url, canonical URL and robots. Pages declare
 * `data: { description, robots }` on their route; anything missing falls back to site defaults.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);

  init(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => this.apply());
  }

  private apply(): void {
    let route = this.route.snapshot;
    while (route.firstChild) route = route.firstChild;

    const description = (route.data['description'] as string | undefined) ?? DEFAULT_DESCRIPTION;
    // The admin CMS must never be indexed, whatever the individual route declares.
    const robots = this.router.url.startsWith('/admin')
      ? 'noindex, nofollow'
      : ((route.data['robots'] as string | undefined) ?? 'index, follow');
    // One address for every copy of the site (www, workers.dev…), so search engines index a single URL.
    const origin = environment.siteUrl || this.document.location.origin;
    const path = this.router.url.split(/[?#]/)[0];
    const url = `${origin}${path === '/' ? '/' : path.replace(/\/$/, '')}`;

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Erotic Garden' });
    this.meta.updateTag({ property: 'og:title', content: this.title.getTitle() });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: `${origin}/${SHARE_IMAGE}` });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }
}
