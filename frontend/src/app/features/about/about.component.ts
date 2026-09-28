import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, ContainerComponent, SectionHeaderComponent, ButtonComponent, ImageRevealComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {}
