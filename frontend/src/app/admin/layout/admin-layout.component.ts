import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);

  readonly links = [
    { label: 'Event inquiries', path: '/admin/events' },
    { label: 'Media', path: '/admin/media' },
  ];
}
