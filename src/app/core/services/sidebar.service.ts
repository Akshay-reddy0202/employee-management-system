import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  readonly isExpanded = signal(false);

  toggle() {
    this.isExpanded.update((value) => !value);
  }

  expand() {
    this.isExpanded.set(true);
  }

  collapse() {
    this.isExpanded.set(false);
  }
}
