import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getProfile(id: string): Observable<EmployeeInterface> {
    return this.http
      .get<EmployeeInterface>(`${this.apiUrl}/employees/${id}`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Employee details not found'));
        }),
      );
  }

  public updateProfile(id: string, request: UpdateProfileRequest): Observable<EmployeeInterface> {
    return this.http
      .patch<EmployeeInterface>(`${this.apiUrl}/employees/${id}`, request, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('failed to update profile'));
        }),
      );
  }
}
