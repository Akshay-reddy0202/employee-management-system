import { Component, inject, input, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { InitialsPipePipe } from '../../pipes/initials.pipe';
import { ClickOutside } from '../../directives/click-outside';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  imports: [InitialsPipePipe, ClickOutside],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css',
})
export class UserMenu {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isMenuOpen = signal(false);

  logout(): void {
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  goToProfile(): void {
    this.closeMenu();
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.closeMenu();
    this.router.navigate(['/settings']);
  }
}
