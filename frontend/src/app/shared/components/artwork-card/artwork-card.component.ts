import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Artwork } from '../../../core/models/artwork.model';
import { ImageRevealComponent } from '../image-reveal/image-reveal.component';
import { TranslatePipe } from '../../../core/i18n/translate.pipe';
import { LanguageService } from '../../../core/i18n/language.service';
import { getDictionary } from '../../../core/i18n/dictionaries';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageRevealComponent, TranslatePipe],
  templateUrl: './artwork-card.component.html',
  styleUrl: './artwork-card.component.css',
})
export class ArtworkCardComponent {
  artwork = input.required<Artwork>();

  private readonly languageService = inject(LanguageService);

  readonly categoryLabel = computed(() => {
    const t = getDictionary(this.languageService.lang()).art.filters;
    return this.artwork().category === 'SCULPTURE' ? t.sculpture : t.garden;
  });
}
