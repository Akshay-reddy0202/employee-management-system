import { Theme } from '../../../core/enums/theme.enum';

export interface EmployeeInterface {
  id?: number;
  role: string;
  employeeId: string;
  fullName: string;
  dateOfBirth: string;
  emailID: string;
  password: string;
  theme: Theme;

  departmentId?: number | null;
  designationId?: number | null;
  managerId?: number | null;
  status?: string | null;
  joiningDate?: string | null;
}
