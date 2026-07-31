import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../core/services/sidebar.service';


@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(public sidebarService: SidebarService) {}

  closeSidebar() {
    this.sidebarService.close();
  }
}
