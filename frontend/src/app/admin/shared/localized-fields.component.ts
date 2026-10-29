import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ADMIN_INPUT, ADMIN_LABEL } from '../admin-ui';

/** EN / TH / DE inputs for one translatable field (EN required, others fall back to EN). */
@Component({
  selector: 'app-localized-fields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <fieldset [formGroup]="group()" class="border border-stone/15 p-4">
      <legend class="px-1 text-xs font-medium uppercase tracking-wider text-stone">{{ label() }}</legend>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div *ngFor="let lang of langs">
          <label [for]="idPrefix() + '-' + lang.code" [class]="labelClass">
            {{ lang.name }}<span *ngIf="lang.code === 'en' && requiredEn()"> *</span>
          </label>
          <textarea
            *ngIf="multiline(); else single"
            [id]="idPrefix() + '-' + lang.code"
            [formControlName]="lang.code"
            rows="3"
            [class]="inputClass"
          ></textarea>
          <ng-template #single>
            <input [id]="idPrefix() + '-' + lang.code" type="text" [formControlName]="lang.code" [class]="inputClass" />
          </ng-template>
        </div>
      </div>
      <p *ngIf="requiredEn() && group().controls['en'].invalid && group().controls['en'].touched" class="mt-2 text-xs text-terracotta">
        English is required.
      </p>
    </fieldset>
  `,
})
export class LocalizedFieldsComponent {
  group = input.required<FormGroup>();
  label = input.required<string>();
  idPrefix = input.required<string>();
  multiline = input(false);
  requiredEn = input(false);

  readonly inputClass = ADMIN_INPUT;
  readonly labelClass = ADMIN_LABEL;
  readonly langs = [
    { code: 'en', name: 'English' },
    { code: 'th', name: 'ไทย' },
    { code: 'de', name: 'Deutsch' },
  ];
}
