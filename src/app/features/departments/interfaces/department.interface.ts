import { DepartmentStatus } from './department-status.type';

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  employeeCount: number;
  status: DepartmentStatus;
}
