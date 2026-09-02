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
import { delayWhen } from 'rxjs';
import { AuthenticatedUserInterface } from '../models/authenticated-user.model';

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

  describe('checkEmailExists', () => {
    it('should check whether the email exists', () => {
      const emailID = 'akshay@gmail.com';
      service.checkEmailExists(emailID).subscribe();
      const request = httpMock.expectOne(`${environment.apiUrl}/employees?emailID=${emailID}`);

      expect(request.request.method).toBe('GET');
      request.flush([]);
    });

    it('should return false when the email does not exist', () => {
      const emailID = 'akshay@gmail.com';
      service.checkEmailExists(emailID).subscribe((result) => {
        expect(result).toBe(false);
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees?emailID=${emailID}`);
      request.flush([]);
    });

    it('should return true when the email exists', () => {
      const emailID = 'akshay@gmail.com';
      const employee = {
        employeeId: 'E0001',
        emailID: 'akshay@gmail.com',
      };
      service.checkEmailExists(emailID).subscribe((result) => {
        expect(result).toBe(true);
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees?emailID=${emailID}`);
      request.flush([employee]);
    });
  });

  describe('getLastEmployee', () => {
    it('should return null when there are no employees', () => {
      service['getLastEmployee']().subscribe((result) => {
        expect(result).toBeNull();
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees`);
      expect(request.request.method).toBe('GET');

      request.flush([]);
    });

    it('should return the employee with the highest employee ID', () => {
      const employees = [
        {
          employeeId: 'E0002',
          fullName: 'Employee Two',
        },
        {
          employeeId: 'E0007',
          fullName: 'Employee Seven',
        },
        {
          employeeId: 'E0004',
          fullName: 'Employee Four',
        },
      ] as EmployeeInterface[];

      service['getLastEmployee']().subscribe((result) => {
        expect(result?.employeeId).toBe('E0007');
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees`);
      expect(request.request.method).toBe('GET');
      request.flush(employees);
    });
  });

  describe('generatesNextEmployeeId', () => {
    it('should generate E0001 when there is no previous employee', () => {
      const result = service['generateNextEmployeeId'](null);

      expect(result).toBe('E0001');
    });

    it('should generate the next employee ID when a previous employee exists', () => {
      const result = service['generateNextEmployeeId']('E0001');

      expect(result).toBe('E0002');
    });

    it('should correctly increment a larger employee ID', () => {
      const result = service['generateNextEmployeeId']('E0015');

      expect(result).toBe('E0016');
    });

    it('should maintain four-digit formatting when generating the next employee ID', () => {
      const result = service['generateNextEmployeeId']('E0099');

      expect(result).toBe('E0100');
    });
  });

  describe('register', () => {
    it('should return an error when the email already exists', () => {
      const signUpForm: SignupRequestInterface = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      service.register(signUpForm).subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error) => {
          expect(error.message).toBe('Email already exists');
        },
      });

      const emailRequest = httpMock.expectOne(
        `${environment.apiUrl}/employees?emailID=${signUpForm.emailID}`,
      );
      expect(emailRequest.request.method).toBe('GET');

      emailRequest.flush([
        {
          employeeId: 'E0001',
          emailID: 'akshay@gmail.com',
        },
      ]);
    });

    it('should get the last employee and register a new employee when the email does not exist', () => {
      const signUpForm: SignupRequestInterface = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      service.register(signUpForm).subscribe((result) => {
        expect(result.employeeId).toBe('E0003');
        expect(result.emailID).toBe('akshay@gmail.com');
      });

      const emailRequest = httpMock.expectOne(
        `${environment.apiUrl}/employees?emailID=${signUpForm.emailID}`,
      );

      expect(emailRequest.request.method).toBe('GET');

      emailRequest.flush([]);

      const employeesRequest = httpMock.expectOne(`${environment.apiUrl}/employees`);

      expect(employeesRequest.request.method).toBe('GET');

      employeesRequest.flush([
        {
          id: 1,
          employeeId: 'E0001',
          emailID: 'first@gmail.com',
        },
        {
          id: 2,
          employeeId: 'E0002',
          emailID: 'second@gmail.com',
        },
      ]);

      const postRequest = httpMock.expectOne(`${environment.apiUrl}/employees`);

      expect(postRequest.request.method).toBe('POST');

      expect(postRequest.request.body).toEqual({
        role: 'Admin',
        employeeId: 'E0003',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        theme: Theme.LIGHT,
      });

      postRequest.flush({
        id: 3,
        role: 'Admin',
        employeeId: 'E0003',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        theme: Theme.LIGHT,
      });
    });

    it('should generate E0001 when there are no employees', () => {
      const signUpForm: SignupRequestInterface = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      service.register(signUpForm).subscribe();

      const emailRequest = httpMock.expectOne(
        `${environment.apiUrl}/employees?emailID=${signUpForm.emailID}`,
      );

      emailRequest.flush([]);

      const employeesRequest = httpMock.expectOne(`${environment.apiUrl}/employees`);

      employeesRequest.flush([]);

      const postRequest = httpMock.expectOne(`${environment.apiUrl}/employees`);

      expect(postRequest.request.body.employeeId).toBe('E0001');

      postRequest.flush({
        ...signUpForm,
        id: 1,
        employeeId: 'E0001',
        password: signUpForm.createPassword,
        theme: Theme.LIGHT,
      });
    });
  });

  describe('checkEmployeeIdExists', () => {
    it('should check whether the employee id exists', () => {
      const employeeId = 'E0001';
      service['checkEmployeeIdExists'](employeeId).subscribe();

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      expect(request.request.method).toBe('GET');
      request.flush([]);
    });

    it('should return the employees matching the employee ID', () => {
      const employeeId = 'E0001';

      const employees = [
        {
          id: '1',
          employeeId: 'E0001',
          fullName: 'Akshay Reddy',
          emailID: 'akshay@gmail.com',
        },
      ] as EmployeeInterface[];

      service['checkEmployeeIdExists'](employeeId).subscribe((result) => {
        expect(result).toEqual(employees);
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      request.flush(employees);
    });
  });

  describe('login', () => {
    it('should return an error when the employee ID does not exist', () => {
      const loginForm: LoginRequestInterface = {
        employeeId: 'E0001',
        password: 'Password@123',
      };

      service.login(loginForm).subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error) => {
          expect(error.message).toBe('Employee Id does not exist');
        },
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${loginForm.employeeId}`,
      );

      expect(request.request.method).toBe('GET');

      request.flush([]);
    });

    it('should return an error when the password is invalid', () => {
      const loginForm: LoginRequestInterface = {
        employeeId: 'E0001',
        password: 'WrongPassword',
      };

      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.login(loginForm).subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error) => {
          expect(error.message).toBe('Invalid Password');
        },
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${loginForm.employeeId}`,
      );

      expect(request.request.method).toBe('GET');

      request.flush([employee]);
    });

    it('should return the employee when the employee ID and password are valid', () => {
      const loginForm: LoginRequestInterface = {
        employeeId: 'E0001',
        password: 'Password@123',
      };

      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.login(loginForm).subscribe((result) => {
        expect(result).toEqual(employee);
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${loginForm.employeeId}`,
      );

      expect(request.request.method).toBe('GET');

      request.flush([employee]);
    });
  });

  describe('getEmployeeById', () => {
    it('should return null when the employee does not exist', () => {
      const employeeId = 'E0001';

      service.getEmployeeById(employeeId).subscribe((result) => {
        expect(result).toBeNull();
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      expect(request.request.method).toBe('GET');

      request.flush([]);
    });

    it('should return the employee when the employee exists', () => {
      const employeeId = 'E0001';

      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.getEmployeeById(employeeId).subscribe((result) => {
        expect(result).toEqual(employee);
      });

      const request = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      expect(request.request.method).toBe('GET');

      request.flush([employee]);
    });
  });

  describe('getEmployeeByEmail', () => {
    it('should return null when the employee emailId does not exist', () => {
      const emailID = 'akshay@gmail.com';

      service.getEmployeeByEmail(emailID).subscribe((result) => {
        expect(result).toBeNull();
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees?emailID=${emailID}`);

      expect(request.request.method).toBe('GET');

      request.flush([]);
    });

    it('should return the employee when the email exists', () => {
      const emailID = 'akshay@gmail.com';

      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      service.getEmployeeByEmail(emailID).subscribe((result) => {
        expect(result).toEqual(employee);
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees?emailID=${emailID}`);

      expect(request.request.method).toBe('GET');

      request.flush([employee]);
    });
  });

  describe('resetPassword', () => {
    it('should return an error when the employee does not exist', () => {
      const employeeId = 'E0001';
      const newPassword = 'NewPassword@123';

      service.resetPassword(employeeId, newPassword).subscribe({
        next: () => {
          throw new Error('Expected an error');
        },
        error: (error) => {
          expect(error.message).toBe('Employee not found');
        },
      });

      const getRequest = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      expect(getRequest.request.method).toBe('GET');

      getRequest.flush([]);
    });

    it('should update the employee password when the employee exists', () => {
      const employeeId = 'E0001';
      const newPassword = 'NewPassword@123';

      const employee = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        password: 'Password@123',
        role: 'Admin',
        dateOfBirth: '2003-02-02',
        theme: Theme.LIGHT,
      } as EmployeeInterface;

      const updatedEmployee = {
        ...employee,
        password: newPassword,
      };

      service.resetPassword(employeeId, newPassword).subscribe((result) => {
        expect(result).toEqual(updatedEmployee);
      });

      const getRequest = httpMock.expectOne(
        `${environment.apiUrl}/employees?employeeId=${employeeId}`,
      );

      expect(getRequest.request.method).toBe('GET');

      getRequest.flush([employee]);

      const patchRequest = httpMock.expectOne(`${environment.apiUrl}/employees/${employee.id}`);

      expect(patchRequest.request.method).toBe('PATCH');

      expect(patchRequest.request.body).toEqual({
        password: newPassword,
      });

      patchRequest.flush(updatedEmployee);
    });
  });

  describe('saveCurrentUser', () => {
    it('should save the current user to localStorage', () => {
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
        role: 'Admin',
        theme: Theme.LIGHT,
      });
    });

    it('should update the logged in user', () => {
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

      expect(service.loggedInUser()).toEqual({
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        email: 'akshay@gmail.com',
        role: 'Admin',
        theme: Theme.LIGHT,
      });
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
        expect(result).toEqual({
          id: '1',
          employeeId: 'E0001',
          fullName: 'Akshay Reddy',
          email: 'akshay@gmail.com',
          role: 'Admin',
          theme: Theme.DARK,
        });
      });

      const request = httpMock.expectOne(`${environment.apiUrl}/employees/${employee.id}`);

      expect(request.request.method).toBe('PATCH');

      expect(request.request.body).toEqual({
        theme: Theme.DARK,
      });

      request.flush({
        ...employee,
        theme: Theme.DARK,
      });

      expect(service.loggedInUser()?.theme).toBe(Theme.DARK);

      const storedUser = JSON.parse(localStorage.getItem('currentuser')!);

      expect(storedUser.theme).toBe(Theme.DARK);
    });
  });

  describe('logout', () => {
    it('should clear the current user and remove the stored user', () => {
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

      expect(service.loggedInUser()).toBeNull();
      expect(localStorage.getItem('currentuser')).toBeNull();
    });

    it('should navigate to sign in after logout', () => {
      service.logout();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/sign-in']);
    });
  });
});
