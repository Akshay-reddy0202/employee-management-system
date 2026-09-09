import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.loggedInUser()?.role;
  const allowedRole = route.data['role'];

  return role === allowedRole ? true : router.createUrlTree(['/dashboard']);
};
