import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DesignationInterface } from '../interfaces/designation.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { CreateDesignationRequest } from '../interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../interfaces/update-designation-request.model';
import { AuthApiResponse } from '../../auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDesignations(): Observable<DesignationInterface[]> {
    return this.http
      .get<AuthApiResponse<DesignationInterface[]>>(`${this.apiUrl}/designations`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Designations Not Found';
          return throwError(() => new Error(message));
        }),
      );
  }

  public createDesignations(
    designation: CreateDesignationRequest,
  ): Observable<DesignationInterface> {
    return this.http
      .post<AuthApiResponse<DesignationInterface>>(`${this.apiUrl}/designations`, designation, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to create designation';
          return throwError(() => new Error(message));
        }),
      );
  }

  public updateDesignations(
    id: string,
    designation: UpdateDesignationRequest,
  ): Observable<DesignationInterface> {
    return this.http
      .patch<AuthApiResponse<DesignationInterface>>(`${this.apiUrl}/designations/${id}`, designation, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to update designation';
          return throwError(() => new Error(message));
        }),
      );
  }
}
