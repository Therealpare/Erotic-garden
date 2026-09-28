import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ImageRevealComponent } from '../image-reveal/image-reveal.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageRevealComponent, TranslatePipe],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.css',
})
export class ExperienceCardComponent {
  title = input.required<string>();
  description = input.required<string>();
  imageUrl = input.required<string>();
  link = input.required<string>();
  meta = input<string | undefined>(undefined);
}
