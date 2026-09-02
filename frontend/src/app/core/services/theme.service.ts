import { effect, Injectable, signal } from '@angular/core';
import { Theme } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<Theme>(Theme.LIGHT);

  constructor() {
    effect(() => {
      const html = document.documentElement;
      if (this.currentTheme() === Theme.DARK) {
        html.classList.add('dark-theme');
      } else {
        html.classList.remove('dark-theme');
      }
    });
  }

  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  public getCurrentTheme(): Theme {
    return this.currentTheme();
  }
}
