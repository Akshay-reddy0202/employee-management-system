import { DepartmentStatus } from './department-status.type';

export interface DepartmentEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  designation?: {
    name: string;
  };
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  employeeCount?: number;
  status: DepartmentStatus;
  employees?: DepartmentEmployee[];
  createdAt?: string;
  updatedAt?: string;
}
