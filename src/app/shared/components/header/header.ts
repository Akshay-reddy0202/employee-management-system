import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { AuthService } from '../../../core/services/auth.service';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ROUTE_DATA } from '../../../core/constants/route-data.constants';
import { UserMenu } from '../user-menu/user-menu';

@Component({
  selector: 'app-header',
  imports: [UserMenu],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public themeService = inject(ThemeService);
  public sidebarService = inject(SidebarService);
  public authService = inject(AuthService);

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly currentTheme = this.themeService.currentTheme;

  private readonly navigationEnd = toSignal(
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)),
    {
      initialValue: null,
    },
  );

  readonly pageTitle = computed(() => {
    this.navigationEnd();

    const activeRoute = this.getDeepestRoute(this.activatedRoute);

    return activeRoute.snapshot?.data[ROUTE_DATA.TITLE] ?? '';
  });

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  sidebarOpen(): void {
    console.log('clicked');
    this.sidebarService.toggle();
  }

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
}
