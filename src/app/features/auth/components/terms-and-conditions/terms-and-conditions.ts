import { A11yModule } from '@angular/cdk/a11y';
import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [A11yModule],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.css',
})
export class TermsAndConditions {
  cancel = output<void>();
  // accept = output<void>();

  // onAccept(): void {
  //   this.accept.emit();
  // }

  private readonly termsContent = viewChild<ElementRef<HTMLDivElement>>('termsContent');
  constructor() {
    afterNextRender(() => {
      this.termsContent()?.nativeElement.focus();
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }
}
