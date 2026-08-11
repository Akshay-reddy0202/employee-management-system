import { Theme } from '../../../core/enums/theme.enum';

export interface EmployeeInterface {
  id?: string;
  role: string;
  employeeId: string;
  fullName: string;
  dateOfBirth: string;
  emailID: string;
  password: string;
  theme: Theme;

  departmentId?: string | null;
  designationId?: string | null;
  managerId?: string | null;
  status?: string | null;
  joiningDate?: string | null;
}
