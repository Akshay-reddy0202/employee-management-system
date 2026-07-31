import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { InitialsPipePipe } from '../../pipes/initials.pipe';
import { ClickOutside } from '../../directives/click-outside';

@Component({
  selector: 'app-user-menu',
  imports: [InitialsPipePipe,ClickOutside],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  protected readonly authService = inject(AuthService);
 
  readonly isMenuOpen = signal(false);

  logout(): void {
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu():void {
    this.isMenuOpen.set(false);
  }

 
}
