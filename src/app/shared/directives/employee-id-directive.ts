import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appEmployeeId]',
})
export class EmployeeIdDirective {
  constructor(private ngControl: NgControl) {}

  ngOnInit(): void {
    this.ngControl.control?.setValue('E');
  }

  @HostListener('input')
  onInput() {
    const value = this.ngControl.control?.value ?? '';

    if (!value) {
      this.ngControl.control?.setValue('E');
      return;
    }
    const digits = value.replace(/\D/g, '').slice(0, 4);

    const formattedValue = 'E' + digits;

    if (formattedValue !== value) {
      this.ngControl.control?.setValue(formattedValue, {
        emitEvent:false
      });
    }
  }
}
