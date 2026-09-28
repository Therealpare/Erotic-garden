import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css',
})
export class SectionHeaderComponent {
  eyebrow = input<string | undefined>(undefined);
  headline = input.required<string>();
  supportingText = input<string | undefined>(undefined);
  align = input<'left' | 'center'>('left');
}
