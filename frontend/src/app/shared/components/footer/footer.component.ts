import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../container/container.component';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly links: NavLink[] = [
    { label: 'About', path: '/about' },
    { label: 'Experience', path: '/experience' },
    { label: 'Art', path: '/art' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Tea House', path: '/tea-house' },
    { label: 'Visit', path: '/visit' },
  ];

  // TODO: OWNER VERIFIED CONTENT REQUIRED — replace with real values via site-settings API.
  readonly address = 'TODO: OWNER VERIFIED CONTENT REQUIRED — Mae Rim, Chiang Mai, Thailand';
  readonly email = 'TODO: OWNER VERIFIED CONTENT REQUIRED';
  readonly phone = 'TODO: OWNER VERIFIED CONTENT REQUIRED';
}
