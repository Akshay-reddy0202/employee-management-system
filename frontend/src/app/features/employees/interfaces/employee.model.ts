import { Theme } from '../../../core/enums/theme.enum';

export interface EmployeeInterface {
  id?: string;
  role: string;
  employeeId: string;
  fullName: string;
  dateOfBirth?: string;
  emailID: string;
  password?: string;
  theme?: Theme;

  salary?: number | null;
  departmentId?: string | null;
  designationId?: string | null;
  managerId?: string | null;
  status?: string | null;
  joiningDate?: string | null;

  department?: { id?: string; name: string; code?: string } | null;
  designation?: { id?: string; name: string } | null;
  manager?: { id?: string; employeeId?: string; fullName: string } | null;

  phoneNumber?: string | null;
  address?: string | null;
  skills?: string[];

  profileImageUrl?: string | null;
}
