import { NavigationItemInterface } from '../models/navigation-item.model';

export const SIDEBAR_MENU: NavigationItemInterface[] = [
  {
    id: 1,
    label: 'Dashboard',
    tooltip: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard',
  },
  {
    id: 2,
    label: 'Employees',
    tooltip: 'Employees',
    route: '/employees',
    icon: 'employees',
  },
  {
    id: 3,
    label: 'Departments',
    tooltip: 'Departments',
    route: '/departments',
    icon: 'departments',
  },
  {
    id: 4,
    label: 'Designations',
    tooltip: 'Designations',
    route: '/designations',
    icon: 'designations',
  },
  {
    id: 5,
    label: 'Attendance',
    tooltip: 'Attendance',
    route: '/attendance',
    icon: 'attendance',
  },
  {
    id: 6,
    label: 'Application',
    tooltip: 'Application',
    route: '/application',
    icon: 'application',
  },
];
