import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { TranslatePipe } from '../../core/i18n/translate.pipe';
import { CoffeeService } from '../../core/services/coffee.service';

@Component({
  selector: 'app-coffee',
  standalone: true,
  imports: [CommonModule, ContainerComponent, SectionHeaderComponent, ButtonComponent, ImageRevealComponent, TranslatePipe],
  templateUrl: './coffee.component.html',
  styleUrl: './coffee.component.css',
})
export class CoffeeComponent {
  private readonly coffeeService = inject(CoffeeService);

  readonly products = toSignal(this.coffeeService.getAll(), { initialValue: [] });

  readonly hasTasteProfile = computed(() =>
    this.products().some((p) => p.origin || p.process || p.roastLevel || p.tastingNotes),
  );
}
