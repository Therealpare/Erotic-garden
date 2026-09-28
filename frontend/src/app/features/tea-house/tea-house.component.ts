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

@Component({
  selector: 'app-tea-house',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, SectionHeaderComponent, ButtonComponent, ImageRevealComponent],
  templateUrl: './tea-house.component.html',
  styleUrl: './tea-house.component.css',
})
export class TeaHouseComponent {
  private readonly teaHouseService = inject(TeaHouseService);

  readonly categories = toSignal(this.teaHouseService.getCategories(), { initialValue: [] });
  readonly menu = toSignal(this.teaHouseService.getMenu(), { initialValue: [] });

  readonly activeCategory = signal<TeaCategoryName>('Tea');

  readonly filteredMenu = computed(() => this.menu().filter((item) => item.category === this.activeCategory()));

  setCategory(category: TeaCategoryName): void {
    this.activeCategory.set(category);
  }
}
