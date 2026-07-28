import { Service, signal } from '@angular/core';

@Service()
export class LoaderService {
  private readonly loading = signal(false);

  readonly isLoading = this.loading.asReadonly();

  show(): void {
    this.loading.set(true);
  }

  hide(): void {
    this.loading.set(false);
  }
}
