import { Routes } from '@angular/router';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';
import { adminAuthGuard } from './core/guards/admin-auth.guard';

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
    path: 'media',
    loadComponent: () => import('./features/media/media.component').then((m) => m.MediaComponent),
    title: 'Media & Press — Erotic Garden & Teahouse',
    data: {
      description:
        'Videos, articles, magazine features, TV segments and reels about Chiang Mai Erotic Garden & Teahouse.',
    },
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/events.component').then((m) => m.EventsComponent),
    title: 'Private Events — Erotic Garden & Teahouse',
    data: {
      description:
        'Host your private event at Chiang Mai Erotic Garden & Teahouse. Send an event inquiry and our team will get back to you.',
    },
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./admin/login/admin-login.component').then((m) => m.AdminLoginComponent),
        title: 'Sign in — EG Admin',
      },
      {
        path: '',
        canActivate: [adminAuthGuard],
        loadComponent: () => import('./admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'events' },
          {
            path: 'events',
            loadComponent: () =>
              import('./admin/events/admin-events-list.component').then((m) => m.AdminEventsListComponent),
            title: 'Event inquiries — EG Admin',
          },
          {
            path: 'events/:id',
            loadComponent: () =>
              import('./admin/events/admin-event-detail.component').then((m) => m.AdminEventDetailComponent),
            title: 'Event inquiry — EG Admin',
          },
          {
            path: 'media',
            loadComponent: () =>
              import('./admin/media/admin-media-list.component').then((m) => m.AdminMediaListComponent),
            title: 'Media — EG Admin',
          },
          {
            path: 'media/new',
            loadComponent: () =>
              import('./admin/media/admin-media-form.component').then((m) => m.AdminMediaFormComponent),
            title: 'Add media — EG Admin',
          },
          {
            path: 'media/:id',
            loadComponent: () =>
              import('./admin/media/admin-media-form.component').then((m) => m.AdminMediaFormComponent),
            title: 'Edit media — EG Admin',
          },
        ],
      },
    ],
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
