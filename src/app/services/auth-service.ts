import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { SignupRequestInterface } from '../models/signup-request-interface';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { EmployeeInterface } from '../models/employee-interface';
import { environment } from '../../environments/environment';
import { LoginRequestInterface } from '../models/login-request-interface';
import { loadingTokenInterceptor, SHOW_LOADER } from '../interceptors/loading-token-interceptor';

import { AuthenticatedUserInterface } from '../models/authenticated-user-interface';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  private readonly currentUser = signal<AuthenticatedUserInterface | null>(null);
  readonly loggedInUser = this.currentUser.asReadonly();
  private readonly STORAGE_KEY = 'currentuser';

  public checkEmailExists(emailID: string): Observable<boolean> {
    return this.http
      .get<EmployeeInterface[]>(`${this.apiUrl}/employees?emailID=${emailID}`)
      .pipe(map((employees) => employees.length > 0));
  }

  private getLastEmployee(): Observable<EmployeeInterface | null> {
    // return this.http
    //   .get<EmployeeInterface[]>(`${this.apiUrl}/employees?_sort=employeeId&_order=desc&_limit=1`)
    //   .pipe(map((employees) => (employees.length > 0 ? employees[0] : null)));

    return this.http.get<EmployeeInterface[]>(`${this.apiUrl}/employees`).pipe(
      map((employees) => {
        if (employees.length === 0) {
          return null;
        }

        const sortedEmployees = [...employees].sort((a, b) => {
          const employeeA = Number(a.employeeId.slice(1));
          const employeeB = Number(b.employeeId.slice(1));

          return employeeB - employeeA;
        });

        return sortedEmployees[0];
      }),
    );
  }

  private generateNextEmployeeId(lastEmployeeId: string | null): string {
    if (!lastEmployeeId) {
      return 'E0001';
    }
    const numericPart = Number(lastEmployeeId.slice(1));
    const nextEmployeeNumber = numericPart + 1;
    return `E${nextEmployeeNumber.toString().padStart(4, '0')}`;
  }

  register(signUpForm: SignupRequestInterface): Observable<EmployeeInterface> {
    return this.checkEmailExists(signUpForm.emailID).pipe(
      switchMap((emailExists) => {
        if (emailExists) {
          return throwError(() => new Error('Email already exists'));
        }
        return this.getLastEmployee().pipe(
          switchMap((lastEmployee) => {
            const nextEmployeeId = this.generateNextEmployeeId(lastEmployee?.employeeId ?? null);
            const employee: EmployeeInterface = {
              role: signUpForm.role,
              employeeId: nextEmployeeId,
              fullName: signUpForm.fullName,
              dateOfBirth: signUpForm.dateOfBirth,
              emailID: signUpForm.emailID,
              password: signUpForm.createPassword,
            };

            return this.http.post<EmployeeInterface>(`${this.apiUrl}/employees`, employee, {
              context: new HttpContext().set(SHOW_LOADER, true),
            });
          }),
        );
      }),
    );
  }

  private checkEmployeeIdExists(employeeId: string): Observable<EmployeeInterface[]> {
    return this.http.get<EmployeeInterface[]>(`${this.apiUrl}/employees?employeeId=${employeeId}`, {
      context: new HttpContext().set(SHOW_LOADER, true),
    });
  }

  login(loginForm: LoginRequestInterface): Observable<EmployeeInterface> {
    return this.checkEmployeeIdExists(loginForm.employeeId).pipe(
      switchMap((employees) => {
        if (employees.length === 0) {
          return throwError(() => new Error('Employee Id does not exist'));
        }
        const employee = employees[0];

        if (employee.password !== loginForm.password) {
          return throwError(() => new Error('Invalid Password'));
        }

        return of(employee);
      }),
    );
  }

  public getEmployeeById(employeeId: string): Observable<EmployeeInterface | null> {
    return this.http
      .get<EmployeeInterface[]>(`${this.apiUrl}/employees?employeeId=${employeeId}`)
      .pipe(map((employees) => (employees.length > 0 ? employees[0] : null)));
  }

  public getEmployeeByEmail(emailID: string): Observable<EmployeeInterface | null> {
    return this.http
      .get<EmployeeInterface[]>(`${this.apiUrl}/employees?emailID=${emailID}`)
      .pipe(map((employees) => (employees.length > 0 ? employees[0] : null)));
  }

  public resetPassword(employeeId: string, newPassword: string): Observable<EmployeeInterface> {
    return this.getEmployeeById(employeeId).pipe(
      switchMap((employee) => {
        if (!employee) {
          return throwError(() => new Error('Employee not found'));
        }
        return this.http.patch<EmployeeInterface>(`${this.apiUrl}/employees/${employee.id}`, {
          password: newPassword,
        });
      }),
    );
  }

  public saveCurrentUser(employee: EmployeeInterface): void {
    const currentUser: AuthenticatedUserInterface = {
      id: employee.id!,
      employeeId: employee.employeeId,
      role: employee.role,
      fullName: employee.fullName,
      dateOfBirth: employee.dateOfBirth,
      emailID: employee.emailID,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentUser));
    this.currentUser.set(currentUser);
  }

  public loadCurrentUser(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);

    if (!storedUser) {
      return;
    }
    const currentUser: AuthenticatedUserInterface = JSON.parse(storedUser);
    this.currentUser.set(currentUser);
  }

  public isAuthenticated(): boolean {
    return this.loggedInUser() !== null;
  }

  public logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
