import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutside {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly enabled = input(true, {
    alias: 'appClickOutside',
  });
  readonly clickOutside = output<void>();

  private emitClickOutside(): void {
    this.clickOutside.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);
    if (!this.enabled()) {
      return;
    }

    if (!clickedInside) {
      this.emitClickOutside();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.enabled()) {
      return;
    }
    this.emitClickOutside();
  }
}
