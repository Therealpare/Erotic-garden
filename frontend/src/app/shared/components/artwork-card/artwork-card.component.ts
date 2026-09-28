import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Artwork } from '../../../core/models/artwork.model';
import { ImageRevealComponent } from '../image-reveal/image-reveal.component';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageRevealComponent],
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.css',
})
export class ArtworkCardComponent {
  artwork = input.required<Artwork>();
}
