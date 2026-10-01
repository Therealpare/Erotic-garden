import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Chiang Mai Erotic Garden & Teahouse — A Garden Beyond Imagination',
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    title: 'About — Erotic Garden & Teahouse',
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
    title: 'Experience — Erotic Garden & Teahouse',
  },
  {
    path: 'art',
    loadComponent: () =>
      import('./features/artworks/artwork-list/artwork-list.component').then((m) => m.ArtworkListComponent),
    title: 'Art — Erotic Garden & Teahouse',
  },
  {
    path: 'art/:slug',
    loadComponent: () =>
      import('./features/artworks/artwork-detail/artwork-detail.component').then((m) => m.ArtworkDetailComponent),
    title: 'Artwork — Erotic Garden & Teahouse',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./features/gallery/gallery.component').then((m) => m.GalleryComponent),
    title: 'Gallery — Erotic Garden & Teahouse',
  },
  {
    path: 'tea-house',
    loadComponent: () => import('./features/tea-house/tea-house.component').then((m) => m.TeaHouseComponent),
    title: 'Tea House — Erotic Garden & Teahouse',
  },
  {
    path: 'coffee',
    loadComponent: () => import('./features/coffee/coffee.component').then((m) => m.CoffeeComponent),
    title: 'Coffee — Erotic Garden & Teahouse',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Checkout — Erotic Garden & Teahouse',
  },
  {
    path: 'visit',
    loadComponent: () => import('./features/visit/visit.component').then((m) => m.VisitComponent),
    title: 'Plan Your Visit — Erotic Garden & Teahouse',
  },
  {
    path: 'booking',
    loadComponent: () => import('./features/booking/booking.component').then((m) => m.BookingComponent),
    title: 'Booking — Erotic Garden & Teahouse',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact — Erotic Garden & Teahouse',
  },
  {
    path: '**',
    component: PlaceholderPageComponent,
    data: { title: 'Page Not Found' },
    title: 'Not Found — Erotic Garden & Teahouse',
  },
];
