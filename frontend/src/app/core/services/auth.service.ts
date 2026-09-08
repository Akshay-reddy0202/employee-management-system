import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SignupRequestInterface } from '../../features/auth/models/signup-request.model';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { EmployeeInterface } from '../../features/employees/interfaces/employee.model';
import { environment } from '../../../environments/environment';
import { LoginRequestInterface } from '../../features/auth/models/login-request.model';
import { AuthenticatedUserInterface } from '../models/authenticated-user.model';
import { SHOW_LOADER } from '../interceptors/loading-token.interceptor';
import { Router } from '@angular/router';
import { Theme } from '../enums/theme.enum';
import {
  AuthApiResponse,
  LoginResponseData,
  RefreshTokenResponseData,
  RegisterResponseData,
} from '../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly router = inject(Router);

  private readonly currentUser = signal<AuthenticatedUserInterface | null>(null);
  readonly loggedInUser = this.currentUser.asReadonly();
  private readonly accessToken = signal<string | null>(null);
  private readonly STORAGE_KEY = 'currentuser';

  public getAccessToken(): string | null {
    return this.accessToken();
  }

  public register(signUpForm: SignupRequestInterface): Observable<RegisterResponseData> {
    const payload = {
      role: signUpForm.role,
      fullName: signUpForm.fullName,
      emailID: signUpForm.emailID,
      dateOfBirth: signUpForm.dateOfBirth,
      password: signUpForm.createPassword,
      confirmPassword: signUpForm.confirmPassword,
      termsAccepted: signUpForm.checkbox,
    };

    return this.http
      .post<AuthApiResponse<RegisterResponseData>>(`${this.apiUrl}/auth/register`, payload, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(map((response) => response.data));
  }

  public login(loginForm: LoginRequestInterface): Observable<LoginResponseData> {
    return this.http
      .post<AuthApiResponse<LoginResponseData>>(
        `${this.apiUrl}/auth/login`,
        {
          employeeId: loginForm.employeeId,
          password: loginForm.password,
        },
        {
          context: new HttpContext().set(SHOW_LOADER, true),
        },
      )
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.accessToken.set(data.accessToken);
          this.saveCurrentUser(data.employee);
        }),
      );
  }

  public refreshToken(): Observable<RefreshTokenResponseData> {
    return this.http
      .post<AuthApiResponse<RefreshTokenResponseData>>(`${this.apiUrl}/auth/refresh`, {})
      .pipe(
        map((response) => response.data),
        tap((data) => {
          this.accessToken.set(data.accessToken);
        }),
      );
  }

  public forgotPassword(emailID: string): Observable<AuthApiResponse> {
    return this.http.post<AuthApiResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      { emailID },
      {
        context: new HttpContext().set(SHOW_LOADER, true),
      },
    );
  }

  public resetPasswordWithToken(
    token: string,
    password: string,
    confirmPassword: string,
  ): Observable<AuthApiResponse> {
    return this.http.post<AuthApiResponse>(
      `${this.apiUrl}/auth/reset-password`,
      { token, password, confirmPassword },
      {
        context: new HttpContext().set(SHOW_LOADER, true),
      },
    );
  }

  public getCurrentUser(): Observable<AuthenticatedUserInterface> {
    return this.http
      .get<AuthApiResponse<AuthenticatedUserInterface>>(`${this.apiUrl}/auth/me`)
      .pipe(
        map((response) => response.data),
        tap((user) => {
          this.currentUser.set(user);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        }),
      );
  }

  public saveCurrentUser(employee: AuthenticatedUserInterface | EmployeeInterface): void {
    const email =
      'emailID' in employee && employee.emailID
        ? employee.emailID
        : 'email' in employee && employee.email
          ? employee.email
          : '';

    const currentUser: AuthenticatedUserInterface = {
      id: employee.id!,
      employeeId: employee.employeeId,
      fullName: employee.fullName,
      email: email,
      emailID: email,
      role: employee.role,
      theme: employee.theme ?? Theme.LIGHT,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentUser));
    this.currentUser.set(currentUser);
  }

  public loadCurrentUser(): void {
    const storedUser = localStorage.getItem(this.STORAGE_KEY);
    if (!storedUser) {
      return;
    }
    try {
      const currentUser: AuthenticatedUserInterface = JSON.parse(storedUser);
      this.currentUser.set(currentUser);
    } catch {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  public initializeSession(): Observable<boolean> {
    this.loadCurrentUser();
    if (!this.currentUser()) {
      return of(false);
    }

    return this.refreshToken().pipe(
      map(() => true),
      catchError(() => {
        this.logout();
        return of(false);
      }),
    );
  }

  public isAuthenticated(): boolean {
    return this.loggedInUser() !== null;
  }

  public updateUserTheme(theme: Theme): Observable<AuthenticatedUserInterface> {
    const currentUser = this.currentUser();
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user'));
    }

    const updatedUser: AuthenticatedUserInterface = {
      ...currentUser,
      theme,
    };

    this.currentUser.set(updatedUser);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
    return of(updatedUser);
  }

  public logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {},
      error: () => {},
    });

    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/sign-in']);
  }
}
