import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.css',
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = toSignal(
    this.route.data.pipe(map((data) => (data['title'] as string) ?? 'Coming Soon')),
    { initialValue: 'Coming Soon' },
  );
}
