import { effect, Service, signal } from '@angular/core';

@Service()
export class ThemeService {
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    effect(() => {
      const html = document.documentElement;
      if (this.currentTheme() === 'dark') {
        html.classList.add('dark-theme');
      } else {
        html.classList.remove('dark-theme');
      }
    });
  }

  public setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
  }

  public getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme();
  }
}
