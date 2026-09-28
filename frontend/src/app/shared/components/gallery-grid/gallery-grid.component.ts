import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImage } from '../../../core/models/gallery.model';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-grid.component.html',
  styleUrl: './gallery-grid.component.css',
})
export class GalleryGridComponent {
  images = input.required<GalleryImage[]>();
  imageSelected = output<number>();
}
