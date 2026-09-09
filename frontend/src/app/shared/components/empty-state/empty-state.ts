import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  public readonly title = input.required<string>();
  public readonly desc = input.required<string>();
  public readonly buttonText = input.required<string>();
  public readonly icon = input('folder_open');
  protected readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }
}
