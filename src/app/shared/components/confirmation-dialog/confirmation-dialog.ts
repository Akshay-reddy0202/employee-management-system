import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();

  readonly confirmText = input('Confirm');
  readonly cancelText = input('Cancel');

  readonly variant = input<'danger' | 'warning' | 'info'>('info');

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  protected onConfirm(): void {
    this.confirm.emit();
  }

  protected onCancel(): void {
    this.cancel.emit();
  }
}
