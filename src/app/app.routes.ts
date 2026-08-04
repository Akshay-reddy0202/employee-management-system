import { Routes } from '@angular/router';
import { SignIn } from './features/auth/pages/sign-in/sign-in';
import { SignUp } from './features/auth/pages/sign-up/sign-up';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { Profile } from './features/profile/profile';
import { Settings } from './features/settings/settings';
import { Employees } from './features/employees/employees';
import { Attendance } from './features/attendance/attendance';
import { Application } from './features/application/application';
import { Departments } from './features/departments/departments';

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
    children: [
      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },
      { path: 'employees', component: Employees, data: { title: 'Employees' } },
      { path: 'departments', component: Departments, data: { title: 'Departments' } },
      { path: 'attendance', component: Attendance, data: { title: 'Attendance' } },
      { path: 'application', component: Application, data: { title: 'Application' } },
      { path: 'profile', component: Profile, data: { title: 'Profile' } },
      { path: 'settings', component: Settings, data: { title: 'Settings' } },
    ],
  },
  { path: '**', redirectTo: 'sign-in' },
];
