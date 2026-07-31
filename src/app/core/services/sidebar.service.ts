import { Service, signal } from '@angular/core';

@Service()
export class SidebarService {
  isSidebarOpen = signal(false);

  toggle() {
    this.isSidebarOpen.update((value) => !value);
  }

  open() {
    this.isSidebarOpen.set(true);
  }

  close() {
    this.isSidebarOpen.set(false);
  }
}
