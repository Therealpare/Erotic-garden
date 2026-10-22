import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly router = inject(Router);

  /** Admin CMS pages bring their own layout, without the public navbar and footer. */
  readonly isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects.startsWith('/admin')),
    ),
    { initialValue: typeof location !== 'undefined' && location.pathname.startsWith('/admin') },
  );

  constructor() {
    inject(SeoService).init();
  }
}
