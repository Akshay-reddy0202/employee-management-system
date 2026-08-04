import { Theme } from "../enums/theme.enum";

export interface AuthenticatedUserInterface {
  id: number;
  employeeId: string;
  role: string;
  fullName: string;
  dateOfBirth: string;
  emailID: string;
  theme: Theme;
}
