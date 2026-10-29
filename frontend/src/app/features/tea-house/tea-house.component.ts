import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { TeaHouseService } from '../../core/services/tea-house.service';
import { TeaCategoryName } from '../../core/models/tea-menu.model';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { pickLocalized } from '../../shared/pipes/localized.pipe';
import { loadState } from '../../shared/utils/load-state.util';
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

  private readonly categoriesState = loadState(this.teaHouseService.getCategories(), []);
  private readonly menuState = loadState(this.teaHouseService.getMenu(), []);

  readonly categories = computed(() => this.categoriesState().data);
  readonly loadStatus = computed(() => {
    const states = [this.categoriesState().status, this.menuState().status];
    return states.includes('error') ? 'error' : states.includes('loading') ? 'loading' : 'ready';
  });

  readonly activeCategory = signal<TeaCategoryName>('Tea');

  /** Display-ready items: name/description in the current language and a formatted price label. */
  readonly menu = computed(() => {
    const lang = this.languageService.lang();
    const free = getDictionary(lang).teaHouse.menu.free;
    return this.menuState().data.map((item) => ({
      ...item,
      displayName: pickLocalized(item.name, lang),
      displayDescription: pickLocalized(item.description, lang),
      priceLabel: item.includedInAdmission ? free : item.price !== null ? `฿${item.price}` : '',
      soldOut: item.status === 'SOLD_OUT',
    }));
  });

  readonly filteredMenu = computed(() => this.menu().filter((item) => item.category === this.activeCategory()));

  readonly showCoffeeNote = computed(() => this.activeCategory() === 'Coffee' && this.filteredMenu().length > 0);

  readonly emptyStateText = computed(() => {
    const t = getDictionary(this.languageService.lang()).teaHouse.menu;
    switch (this.activeCategory()) {
      case 'Dessert':
        return { title: t.dessertEmptyTitle, message: t.dessertEmptyMessage };
      case 'Drinks':
        return { title: t.drinksEmptyTitle, message: t.drinksEmptyMessage };
      default:
        return { title: t.specialEmptyTitle, message: t.specialEmptyMessage };
    }
  });

  setCategory(category: TeaCategoryName): void {
    this.activeCategory.set(category);
  }

  categoryLabel(category: TeaCategoryName): string {
    const t = getDictionary(this.languageService.lang()).teaHouse.menu;
    const map: Record<TeaCategoryName, string> = {
      Tea: t.categoryTea,
      Coffee: t.categoryCoffee,
      Drinks: t.categoryDrinks,
      Dessert: t.categoryDessert,
      Special: t.categorySpecial,
    };
    return map[category];
  }
}
