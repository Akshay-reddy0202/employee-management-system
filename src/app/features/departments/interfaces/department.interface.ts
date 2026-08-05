import { DepartmentStatus } from './department-status.type';

export interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  employeeCount: number;
  status: DepartmentStatus;
}
