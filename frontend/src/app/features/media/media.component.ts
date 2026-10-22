import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { YoutubePlayerComponent } from '../../shared/components/youtube-player/youtube-player.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { MediaService } from '../../core/services/media.service';
import { MEDIA_TYPES, MediaItem, MediaType } from '../../core/models/media.model';
import { formatCalendarDate } from '../../shared/utils/date.util';

type MediaFilter = 'ALL' | MediaType;

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule, ContainerComponent, EmptyStateComponent, YoutubePlayerComponent, TranslatePipe],
  templateUrl: './media.component.html',
})
export class MediaComponent {
  private readonly mediaService = inject(MediaService);
  private readonly languageService = inject(LanguageService);

  /** undefined while loading; the API resolves to [] on any failure. */
  readonly items = toSignal(this.mediaService.getPublished().pipe(map((items) => items as MediaItem[] | undefined)), {
    initialValue: undefined,
  });

  readonly activeFilter = signal<MediaFilter>('ALL');

  /** Only offer filters for types that actually have published items. */
  readonly filters = computed<MediaFilter[]>(() => {
    const present = new Set((this.items() ?? []).map((item) => item.type));
    return ['ALL', ...MEDIA_TYPES.filter((type) => present.has(type))];
  });

  readonly visibleItems = computed(() => {
    const filter = this.activeFilter();
    const items = this.items() ?? [];
    return filter === 'ALL' ? items : items.filter((item) => item.type === filter);
  });

  setFilter(filter: MediaFilter): void {
    this.activeFilter.set(filter);
  }

  formatDate(isoDate: string): string {
    return formatCalendarDate(isoDate, this.languageService.lang());
  }

  actionKey(item: MediaItem): string {
    return item.type === 'ARTICLE' || item.type === 'MAGAZINE' ? 'media.read' : 'media.watch';
  }
}
