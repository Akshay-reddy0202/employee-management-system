import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar-service';
import { ThemeService } from '../../services/theme-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  public sidebarService = inject(SidebarService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isRoleMenuOpen = signal(false);

  constructor() {}

  sidebarOpen(): void {
    console.log('clicked');
    this.sidebarService.toggle();
  }

  readonly currentTheme = this.themeService.currentTheme;

  changeTheme(): void {
    const currentTheme = this.themeService.getCurrentTheme();
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nextTheme);

    this.authService.updateUserTheme(nextTheme).subscribe({
      next: () => {},
      error: () => {
        this.themeService.setTheme(currentTheme);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }

  toggleRoleDropdown(): void {
    this.isRoleMenuOpen.update((value) => !value);
  }
}
