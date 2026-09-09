import { AuthenticatedUserInterface } from '../../../core/models/authenticated-user.model';

export interface AuthApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  employee: AuthenticatedUserInterface;
  accessToken: string;
}

export interface RegisterResponseData {
  id: string;
  employeeId: string;
  fullName: string;
  emailID: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
}
