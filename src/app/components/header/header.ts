import { Component, inject } from '@angular/core';
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

  constructor() {}

  sidebarOpen(): void {
    console.log('clicked');
    this.sidebarService.toggle();
  }

  readonly isDarkTheme = this.themeService.isDarkTheme;

  changeTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/sign-in']);
  }
}
