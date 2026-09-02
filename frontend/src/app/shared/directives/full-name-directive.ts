import { Directive, HostListener } from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appFullName]',
})
export class FullNameDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input')
  onInput():void {
    const value = this.ngControl.control?.value??'';
    const formattedValue = value.replace(/[^a-zA-Z\s]/g, '');

    if (formattedValue !== value) {
      this.ngControl.control?.setValue(formattedValue, {
        emitEvent: false,
      });
    }
  }
}
