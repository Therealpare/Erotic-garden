import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline-light';
type ButtonKind = 'href' | 'routerLink' | 'button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  routerLink = input<string | undefined>(undefined);
  href = input<string | undefined>(undefined);

  readonly kind = computed<ButtonKind>(() => {
    if (this.href()) return 'href';
    if (this.routerLink()) return 'routerLink';
    return 'button';
  });

  readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-forest text-ivory hover:bg-charcoal',
    secondary: 'bg-transparent text-forest border border-forest hover:bg-forest hover:text-ivory',
    ghost: 'bg-transparent text-forest hover:text-terracotta',
    'outline-light': 'bg-transparent text-ivory border border-ivory hover:bg-ivory hover:text-forest',
  };
}
