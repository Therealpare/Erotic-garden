import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { TeaHouseService } from '../../core/services/tea-house.service';
import { TeaCategoryName } from '../../core/models/tea-menu.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { LanguageService } from '../../core/i18n/language.service';
import { getDictionary } from '../../core/i18n/dictionaries';

@Component({
  selector: 'app-tea-house',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ContainerComponent,
    SectionHeaderComponent,
    ButtonComponent,
    ImageRevealComponent,
    TranslatePipe,
  ],
  templateUrl: './tea-house.component.html',
  styleUrl: './tea-house.component.css',
})
export class TeaHouseComponent {
  private readonly teaHouseService = inject(TeaHouseService);
  private readonly languageService = inject(LanguageService);

  readonly categories = toSignal(this.teaHouseService.getCategories(), { initialValue: [] });
  readonly menu = toSignal(this.teaHouseService.getMenu(), { initialValue: [] });

  readonly activeCategory = signal<TeaCategoryName>('Tea');

  readonly filteredMenu = computed(() => this.menu().filter((item) => item.category === this.activeCategory()));

  setCategory(category: TeaCategoryName): void {
    this.activeCategory.set(category);
  }

  categoryLabel(category: TeaCategoryName): string {
    const t = getDictionary(this.languageService.lang()).teaHouse.menu;
    const map: Record<TeaCategoryName, string> = {
      Tea: t.categoryTea,
      Coffee: t.categoryCoffee,
      Dessert: t.categoryDessert,
      Special: t.categorySpecial,
    };
    return map[category];
  }
}
