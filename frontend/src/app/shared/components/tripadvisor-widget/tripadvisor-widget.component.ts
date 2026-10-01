import { Component, ElementRef, OnChanges, OnDestroy, ViewChild, input } from '@angular/core';

/**
 * Renders an official Tripadvisor widget embed, generated from Tripadvisor's own
 * Widget Center (https://www.tripadvisor.com/Widgets) for this business's real
 * Location ID. Spec §18/§48: we never hand-construct Tripadvisor's widget markup or
 * scrape Tripadvisor ourselves — only the verbatim snippet Tripadvisor generates for
 * the owner's real listing is used. Pass that snippet (including its <script> tag) via
 * [embedHtml]; this component renders nothing until a real snippet is provided.
 */
@Component({
  selector: 'app-tripadvisor-widget',
  standalone: true,
  template: `<div #host></div>`,
})
export class TripadvisorWidgetComponent implements OnChanges, OnDestroy {
  embedHtml = input<string>('');

  @ViewChild('host', { static: true }) private readonly host!: ElementRef<HTMLDivElement>;

  ngOnChanges(): void {
    this.render();
  }

  ngOnDestroy(): void {
    this.host.nativeElement.innerHTML = '';
  }

  private render(): void {
    const container = this.host.nativeElement;
    container.innerHTML = '';

    const html = this.embedHtml();
    if (!html) return;

    // innerHTML does not execute <script> tags, so each one is re-created to run Tripadvisor's widget loader.
    const template = document.createElement('template');
    template.innerHTML = html;
    Array.from(template.content.childNodes).forEach((node) => {
      if (node instanceof HTMLScriptElement) {
        const script = document.createElement('script');
        Array.from(node.attributes).forEach((attr) => script.setAttribute(attr.name, attr.value));
        script.text = node.text;
        container.appendChild(script);
      } else {
        container.appendChild(node.cloneNode(true));
      }
    });
  }
}
