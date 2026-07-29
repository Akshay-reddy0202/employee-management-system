import { Component, output } from '@angular/core';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [],
  templateUrl: './terms-and-conditions.html',
  styleUrl: './terms-and-conditions.css',
})
export class TermsAndConditions {
  cancel = output<void>();
  // accept = output<void>();

  // onAccept(): void {
  //   this.accept.emit();
  // }

  onCancel(): void {
    this.cancel.emit();
  }
}
