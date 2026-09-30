import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
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
    EmptyStateComponent,
    TranslatePipe,
  ],
  templateUrl: './tea-house.component.html',
  styleUrl: './tea-house.component.css',
})
export class TeaHouseComponent {
  private readonly teaHouseService = inject(TeaHouseService);
  private readonly languageService = inject(LanguageService);

  readonly categories = toSignal(this.teaHouseService.getCategories(), { initialValue: [] });
  private readonly rawMenu = toSignal(this.teaHouseService.getMenu(), { initialValue: [] });

  readonly activeCategory = signal<TeaCategoryName>('Tea');

  readonly menu = computed(() => {
    const t = getDictionary(this.languageService.lang()).teaHouse;
    const items = t.menuItems as Record<string, { name: string }>;
    const free = t.menu.free;
    return this.rawMenu().map((item) => {
      const translated = items[item.slug];
      const isIncluded = item.category === 'Tea' || item.category === 'Coffee';
      return {
        ...item,
        name: translated ? translated.name : item.name,
        price: isIncluded ? free : item.price,
      };
    });
  });

  readonly filteredMenu = computed(() => this.menu().filter((item) => item.category === this.activeCategory()));

  readonly showCoffeeNote = computed(() => this.activeCategory() === 'Coffee' && this.filteredMenu().length > 0);

  readonly emptyStateText = computed(() => {
    const t = getDictionary(this.languageService.lang()).teaHouse.menu;
    return this.activeCategory() === 'Dessert'
      ? { title: t.dessertEmptyTitle, message: t.dessertEmptyMessage }
      : { title: t.specialEmptyTitle, message: t.specialEmptyMessage };
  });

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
