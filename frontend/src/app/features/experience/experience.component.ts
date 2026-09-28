import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { ContainerComponent } from '../../shared/components/container/container.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ImageRevealComponent } from '../../shared/components/image-reveal/image-reveal.component';
import { ExperienceService } from '../../core/services/experience.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, RouterLink, ContainerComponent, ButtonComponent, ImageRevealComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css',
})
export class ExperienceComponent {
  private readonly experienceService = inject(ExperienceService);

  readonly experiences = toSignal(this.experienceService.getAll(), { initialValue: [] });
}
