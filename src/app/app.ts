import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loader } from './shared/components/loader/loader';
import { AuthService } from './services/auth-service';
import { ThemeService } from './services/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('employee-management-system');
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    this.authService.loadCurrentUser();

    const currentUser = this.authService.loggedInUser();

    if (currentUser) {
      this.themeService.setTheme(currentUser.theme);
    }
  }
}
