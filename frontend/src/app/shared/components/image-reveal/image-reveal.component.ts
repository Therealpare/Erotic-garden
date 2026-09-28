import { AfterViewInit, Component, ElementRef, OnDestroy, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-reveal.component.html',
  styleUrl: './image-reveal.component.css',
})
export class ImageRevealComponent implements AfterViewInit, OnDestroy {
  src = input.required<string>();
  alt = input.required<string>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  readonly isVisible = signal(false);

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.isVisible.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isVisible.set(true);
          this.observer?.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
