import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutside {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  readonly clickOutside = output<void>();

  private emitClickOutside(): void {
    this.clickOutside.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.emitClickOutside();
  }
}
