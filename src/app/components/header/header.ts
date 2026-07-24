import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../services/sidebar-service';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  public sidebarService = inject(SidebarService);
  constructor() {}

  sidebarOpen() {
    console.log('clicked');
    this.sidebarService.toggle();
  }

  readonly isDarkTheme = this.themeService.isDarkTheme;

  changeTheme() {
    this.themeService.toggle();
  }
}
