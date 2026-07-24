import { effect, Service, signal } from '@angular/core';

@Service()
export class ThemeService {
  isDarkTheme = signal(false);

  constructor() {
    effect(() => {
      const html = document.documentElement;
      if (this.isDarkTheme()) {
        html.classList.add('dark-theme');
      } else {
        html.classList.remove('dark-theme');
      }
    });
  }

  get() {
    const currentTheme = this.isDarkTheme();
  }
  
  toggle() {
    this.isDarkTheme.update((value) => !value);
  }

  lightTheme() {
    this.isDarkTheme.set(false);
  }

  darkTheme() {
    this.isDarkTheme.set(true);
  }
}
