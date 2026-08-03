import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';
import { SIDEBAR_MENU } from '../../../core/constants/sidebar-menu.constants';
import { NavigationItem } from './navigation-item/navigation-item';
import { ClickOutside } from '../../directives/click-outside';

@Component({
  selector: 'app-sidebar',
  imports: [NavigationItem],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  protected readonly sidebarService = inject(SidebarService);
  protected readonly navigationItems = SIDEBAR_MENU;
}
