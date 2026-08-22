import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-employee-id-dialog',
  imports: [],
  templateUrl: './employee-id-dialog.html',
  styleUrl: './employee-id-dialog.css',
})
export class EmployeeIdDialog {
  readonly employeeId = input.required<string>();
  close = output<void>();
  protected readonly isAcknowledged = signal(false);

  protected copyEmployeeId(): void {
    navigator.clipboard.writeText(this.employeeId());
  }

  protected downloadEmployeeId(): void {
    const blob = new Blob([`Employee ID: ${this.employeeId()}`], { type: 'text/plain' });

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'employee-id.txt';

    anchor.click();

    window.URL.revokeObjectURL(url);
  }

  protected continue(): void {
    this.close.emit();
  }
}
