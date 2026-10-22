import { Component, ElementRef, computed, effect, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { youtubeEmbedUrl, youtubeThumbnailUrl } from '../../utils/youtube.util';

/**
 * Click-to-load YouTube player. Only a thumbnail is shown until the visitor chooses to play,
 * so no YouTube scripts or cookies load with the page (performance + privacy).
 */
@Component({
  selector: 'app-youtube-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './youtube-player.component.html',
})
export class YoutubePlayerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  videoId = input.required<string>();
  title = input.required<string>();
  thumbnailUrl = input<string | null>(null);
  playLabel = input('Play video:');
  /** Two-way bindable so an outside "Watch Video" button can start playback. */
  playing = model(false);

  readonly thumbnail = computed(() => this.thumbnailUrl() || youtubeThumbnailUrl(this.videoId()));
  readonly embedUrl = computed<SafeResourceUrl>(() =>
    // The id is validated server-side to [A-Za-z0-9_-]{11}, and the host is fixed here.
    this.sanitizer.bypassSecurityTrustResourceUrl(youtubeEmbedUrl(this.videoId())),
  );

  constructor() {
    // Move focus into the player when playback starts from elsewhere, so keyboard users land on it.
    effect(() => {
      if (this.playing()) {
        queueMicrotask(() => this.host.nativeElement.querySelector('iframe')?.focus());
      }
    });
  }

  play(): void {
    this.playing.set(true);
  }
}
