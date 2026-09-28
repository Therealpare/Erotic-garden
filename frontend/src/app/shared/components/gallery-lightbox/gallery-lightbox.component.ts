import { Component, ElementRef, HostListener, computed, effect, input, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImage } from '../../../core/models/gallery.model';

@Component({
  selector: 'app-gallery-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-lightbox.component.html',
  styleUrl: './gallery-lightbox.component.css',
})
export class GalleryLightboxComponent {
  images = input.required<GalleryImage[]>();
  activeIndex = input<number | null>(null);

  closed = output<void>();
  indexChange = output<number>();

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  readonly activeImage = computed(() => {
    const index = this.activeIndex();
    return index === null ? null : this.images()[index];
  });

  constructor() {
    effect(() => {
      if (this.activeIndex() !== null) {
        queueMicrotask(() => this.closeButton()?.nativeElement.focus());
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.activeIndex() === null) return;
    if (event.key === 'Escape') this.close();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.previous();
  }

  close(): void {
    this.closed.emit();
  }

  next(): void {
    const index = this.activeIndex();
    if (index === null) return;
    this.indexChange.emit((index + 1) % this.images().length);
  }

  previous(): void {
    const index = this.activeIndex();
    if (index === null) return;
    this.indexChange.emit((index - 1 + this.images().length) % this.images().length);
  }
}
