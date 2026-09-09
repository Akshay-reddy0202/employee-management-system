import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in',
        loadComponent: () => import('./features/auth/pages/sign-in/sign-in').then((m) => m.SignIn),
        data: {
          title: 'Sign In',
        },
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./features/auth/pages/sign-up/sign-up').then((m) => m.SignUp),
        data: {
          title: 'Sign Up',
        },
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/components/reset-password/reset-password').then(
            (m) => m.ResetPassword,
          ),
        data: {
          title: 'Reset Password',
        },
      },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
        data: { title: 'Dashboard' },
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/pages/employees').then((m) => m.Employees),
        canActivate: [roleGuard],
        data: { title: 'Employees', role: 'Admin' },
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/pages/departments').then((m) => m.Departments),
        canActivate: [roleGuard],
        data: { title: 'Departments', role: 'Admin' },
      },
      {
        path: 'designations',
        loadComponent: () =>
          import('./features/designations/pages/designation').then((m) => m.Designation),
        canActivate: [roleGuard],
        data: { title: 'Designations', role: 'Admin' },
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/attendance/attendance').then((m) => m.Attendance),
        data: { title: 'Attendance' },
      },
      {
        path: 'application',
        loadComponent: () =>
          import('./features/application/application').then((m) => m.Application),
        data: { title: 'Application' },
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/pages/profile').then((m) => m.Profile),
        data: { title: 'Profile' },
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then((m) => m.Settings),
        data: { title: 'Settings' },
      },
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
