import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { SIDEBAR_MENU } from '../../../core/constants/sidebar-menu.constants';
import { NavigationItem } from './navigation-item/navigation-item';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationItem, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly authService = inject(AuthService);

  protected get navigationItems() {
    const role = this.authService.loggedInUser()?.role;
    return SIDEBAR_MENU.filter((item) => !item.roles || item.roles.includes(role ?? ''));
  }

}
