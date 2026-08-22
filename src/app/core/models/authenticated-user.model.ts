import { Theme } from '../enums/theme.enum';

export interface AuthenticatedUserInterface {
  id: string;
  employeeId: string;
  role: string;
  fullName: string;
  email: string;
  theme: Theme;
}
