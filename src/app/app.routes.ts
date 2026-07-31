import { Routes } from '@angular/router';

import { SignIn } from './features/auth/pages/sign-in/sign-in';
import { SignUp } from './features/auth/pages/sign-up/sign-up';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in',
        component: SignIn,
        data: {
          title: 'Sign In',
        },
      },
      {
        path: 'sign-up',
        component: SignUp,
        data: {
          title: 'Sign Up',
        },
      },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [{ path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } }],
  },
  { path: '**', redirectTo: 'sign-in' },
];
