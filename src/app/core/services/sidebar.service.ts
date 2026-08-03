import { Service, signal } from '@angular/core';

@Service()
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
