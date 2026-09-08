import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';
import { AuthApiResponse } from '../../auth/models/login-response.model';

export interface ProfileImageResponse {
  id: string;
  fullName: string;
  profileImageUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getProfile(id?: string): Observable<EmployeeInterface> {
    const url = id ? `${this.apiUrl}/profile` : `${this.apiUrl}/profile`;
    return this.http
      .get<AuthApiResponse<EmployeeInterface>>(url, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Employee details not found';
          return throwError(() => new Error(message));
        }),
      );
  }

  public updateProfile(request: UpdateProfileRequest): Observable<EmployeeInterface> {
    return this.http
      .patch<AuthApiResponse<EmployeeInterface>>(`${this.apiUrl}/profile`, request, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Failed to update profile';
          return throwError(() => new Error(message));
        }),
      );
  }

  public uploadProfileImage(file: File): Observable<ProfileImageResponse> {
    const formData = new FormData();
    formData.append('profileImage', file);

    return this.http
      .patch<AuthApiResponse<ProfileImageResponse>>(`${this.apiUrl}/profile/image`, formData, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Failed to upload profile image';
          return throwError(() => new Error(message));
        }),
      );
  }

  public removeProfileImage(): Observable<ProfileImageResponse> {
    return this.http
      .delete<AuthApiResponse<ProfileImageResponse>>(`${this.apiUrl}/profile/image`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Failed to remove profile image';
          return throwError(() => new Error(message));
        }),
      );
  }
}
