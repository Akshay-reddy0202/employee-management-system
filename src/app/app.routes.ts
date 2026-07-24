import { Routes } from '@angular/router';
import { SignIn } from './components/sign-in/sign-in';
import { SignUp } from './components/sign-up/sign-up';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: 'sign-in', component: SignIn },
      { path: 'sign-up', component: SignUp },
    ],
  },
  {
    path: '',
    component: DashboardLayout,
    children: [{ path: 'dashboard', component: Dashboard }],
  },
  { path: '**', redirectTo: 'sign-in' },
];
