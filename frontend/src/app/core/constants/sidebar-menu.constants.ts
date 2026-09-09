import { NavigationItemInterface } from '../models/navigation-item.model';

export const SIDEBAR_MENU: NavigationItemInterface[] = [
  {
    id: 1,
    label: 'Dashboard',
    tooltip: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard',
    roles: ['Admin', 'Employee'],
  },
  {
    id: 2,
    label: 'Employees',
    tooltip: 'Employees',
    route: '/employees',
    icon: 'employees',
    roles: ['Admin'],
  },
  {
    id: 3,
    label: 'Departments',
    tooltip: 'Departments',
    route: '/departments',
    icon: 'departments',
    roles: ['Admin'],
  },
  {
    id: 4,
    label: 'Designations',
    tooltip: 'Designations',
    route: '/designations',
    icon: 'designations',
    roles: ['Admin'],
  },
  {
    id: 5,
    label: 'Attendance',
    tooltip: 'Attendance',
    route: '/attendance',
    icon: 'attendance',
    roles: ['Admin', 'Employee'],
  },
  {
    id: 6,
    label: 'Application',
    tooltip: 'Application',
    route: '/application',
    icon: 'application',
    roles: ['Admin', 'Employee'],
  },
];
