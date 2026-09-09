import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EmployeeInterface } from '../../features/employees/interfaces/employee.model';
import { Theme } from '../enums/theme.enum';
import { environment } from '../../../environments/environment';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SignupRequestInterface } from '../../features/auth/models/signup-request.model';
import { LoginRequestInterface } from '../../features/auth/models/login-request.model';
import { AuthenticatedUserInterface } from '../models/authenticated-user.model';
import {
  AuthApiResponse,
  LoginResponseData,
  RefreshTokenResponseData,
  RegisterResponseData,
} from '../../features/auth/models/login-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const routerMock = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should send a POST request to register an employee and return registered data', () => {
      const signUpForm: SignupRequestInterface = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      const mockResponse: AuthApiResponse<RegisterResponseData> = {
        success: true,
        message: 'Employee registered successfully',
        data: {
          id: 'emp-1',
          employeeId: 'E0001',
          fullName: 'Akshay Reddy',
          emailID: 'akshay@gmail.com',
          role: 'Admin',
          status: 'Active',
          createdAt: '2026-09-09T00:00:00.000Z',
        },
      };

      service.register(signUpForm).subscribe((result) => {
        expect(result).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        role: signUpForm.role,
        fullName: signUpForm.fullName,
        emailID: signUpForm.emailID,
        dateOfBirth: signUpForm.dateOfBirth,
        password: signUpForm.createPassword,
        confirmPassword: signUpForm.confirmPassword,
        termsAccepted: signUpForm.checkbox,
      });

      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should send a POST request to login, save user & token, and return login data', () => {
      const loginForm: LoginRequestInterface = {
        employeeId: 'E0001',
        password: 'Password@123',
      };

      const mockUser: AuthenticatedUserInterface = {
        id: 'emp-1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        email: 'akshay@gmail.com',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        theme: Theme.LIGHT,
      };

      const mockResponse: AuthApiResponse<LoginResponseData> = {
        success: true,
        message: 'Login successful',
        data: {
          employee: mockUser,
          accessToken: 'jwt-access-token-123',
        },
      };

      service.login(loginForm).subscribe((result) => {
        expect(result).toEqual(mockResponse.data);
        expect(service.getAccessToken()).toBe('jwt-access-token-123');
        expect(service.loggedInUser()).toEqual(mockUser);
        const stored = JSON.parse(localStorage.getItem('currentuser')!);
        expect(stored.employeeId).toBe('E0001');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        employeeId: loginForm.employeeId,
        password: loginForm.password,
      });

      req.flush(mockResponse);
    });
  });

  describe('refreshToken', () => {
    it('should send a POST request to refresh token and update accessToken signal', () => {
      const mockResponse: AuthApiResponse<RefreshTokenResponseData> = {
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: 'new-refreshed-token',
        },
      };

      service.refreshToken().subscribe((result) => {
        expect(result).toEqual(mockResponse.data);
        expect(service.getAccessToken()).toBe('new-refreshed-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});

      req.flush(mockResponse);
    });
  });

  describe('forgotPassword', () => {
    it('should send a POST request to forgot-password with email', () => {
      const emailID = 'akshay@gmail.com';
      const mockResponse: AuthApiResponse = {
        success: true,
        message: 'Password reset link sent',
        data: null,
      };

      service.forgotPassword(emailID).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ emailID });

      req.flush(mockResponse);
    });
  });

  describe('resetPasswordWithToken', () => {
    it('should send a POST request to reset-password with token and new password', () => {
      const token = 'reset-token-abc';
      const password = 'NewPassword@123';
      const confirmPassword = 'NewPassword@123';

      const mockResponse: AuthApiResponse = {
        success: true,
        message: 'Password reset successfully',
        data: null,
      };

      service.resetPasswordWithToken(token, password, confirmPassword).subscribe((result) => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token, password, confirmPassword });

      req.flush(mockResponse);
    });
  });

  describe('getCurrentUser', () => {
    it('should send a GET request to /auth/me and update current user', () => {
      const mockUser: AuthenticatedUserInterface = {
        id: 'emp-1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        email: 'akshay@gmail.com',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        theme: Theme.LIGHT,
      };

      const mockResponse: AuthApiResponse<AuthenticatedUserInterface> = {
        success: true,
        message: 'User retrieved',
        data: mockUser,
      };

      service.getCurrentUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(service.loggedInUser()).toEqual(mockUser);
        expect(JSON.parse(localStorage.getItem('currentuser')!)).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('saveCurrentUser', () => {
    it('should save the current user to localStorage and update loggedInUser signal', () => {
      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        password: 'Password@123',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.saveCurrentUser(employee);

      const storedUser = JSON.parse(localStorage.getItem('currentuser')!);

      expect(storedUser).toEqual({
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        email: 'akshay@gmail.com',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        theme: Theme.LIGHT,
      });

      expect(service.loggedInUser()).toEqual(storedUser);
    });

    it('should handle employee object with email property instead of emailID', () => {
      const user: AuthenticatedUserInterface = {
        id: '2',
        employeeId: 'E0002',
        fullName: 'Jane Doe',
        email: 'jane@gmail.com',
        role: 'Employee',
      };

      service.saveCurrentUser(user);

      expect(service.loggedInUser()?.email).toBe('jane@gmail.com');
    });
  });

  describe('loadCurrentUser', () => {
    it('should not update the current user when no user is stored', () => {
      localStorage.removeItem('currentuser');

      service.loadCurrentUser();

      expect(service.loggedInUser()).toBeNull();
    });

    it('should load the stored user into the current user', () => {
      const storedUser: AuthenticatedUserInterface = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        email: 'akshay@gmail.com',
        role: 'Admin',
        theme: Theme.LIGHT,
      };

      localStorage.setItem('currentuser', JSON.stringify(storedUser));

      service.loadCurrentUser();

      expect(service.loggedInUser()).toEqual(storedUser);
    });

    it('should clear localStorage if the stored user is invalid JSON', () => {
      localStorage.setItem('currentuser', 'invalid-json');

      service.loadCurrentUser();

      expect(service.loggedInUser()).toBeNull();
      expect(localStorage.getItem('currentuser')).toBeNull();
    });
  });

  describe('initializeSession', () => {
    it('should return false if there is no user in localStorage', () => {
      localStorage.removeItem('currentuser');

      service.initializeSession().subscribe((result) => {
        expect(result).toBe(false);
      });
    });

    it('should return true when refresh token succeeds during initialization', () => {
      const storedUser: AuthenticatedUserInterface = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        role: 'Admin',
      };
      localStorage.setItem('currentuser', JSON.stringify(storedUser));

      service.initializeSession().subscribe((result) => {
        expect(result).toBe(true);
      });

      const refreshReq = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(refreshReq.request.method).toBe('POST');
      refreshReq.flush({
        success: true,
        message: 'Refreshed',
        data: { accessToken: 'new-token' },
      });
    });

    it('should clear session and return false when refresh token fails during initialization', () => {
      const storedUser: AuthenticatedUserInterface = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        role: 'Admin',
      };
      localStorage.setItem('currentuser', JSON.stringify(storedUser));

      service.initializeSession().subscribe((result) => {
        expect(result).toBe(false);
        expect(service.loggedInUser()).toBeNull();
        expect(localStorage.getItem('currentuser')).toBeNull();
      });

      const refreshReq = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      refreshReq.error(new ProgressEvent('error'), { status: 401 });
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when there is no authenticated user', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return true when there is an authenticated user', () => {
      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        password: 'Password@123',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.saveCurrentUser(employee);

      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('updateUserTheme', () => {
    it('should return an error when there is no authenticated user', () => {
      service.updateUserTheme(Theme.DARK).subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error) => {
          expect(error.message).toBe('No authenticated user');
        },
      });
    });

    it('should update the user theme when the user is authenticated', () => {
      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        password: 'Password@123',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.saveCurrentUser(employee);

      service.updateUserTheme(Theme.DARK).subscribe((result) => {
        expect(result.theme).toBe(Theme.DARK);
        expect(service.loggedInUser()?.theme).toBe(Theme.DARK);
        const storedUser = JSON.parse(localStorage.getItem('currentuser')!);
        expect(storedUser.theme).toBe(Theme.DARK);
      });
    });
  });

  describe('logout', () => {
    it('should send logout POST request, clear user/token, and navigate to /sign-in', () => {
      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        password: 'Password@123',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.saveCurrentUser(employee);

      expect(service.loggedInUser()).not.toBeNull();
      expect(localStorage.getItem('currentuser')).not.toBeNull();

      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(service.loggedInUser()).toBeNull();
      expect(service.getAccessToken()).toBeNull();
      expect(localStorage.getItem('currentuser')).toBeNull();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/sign-in']);
    });
  });
});
