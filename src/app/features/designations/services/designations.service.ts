import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DesignationInterface } from '../interfaces/designation.model';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { CreateDesignationRequest } from '../interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../interfaces/update-designation-request.model';

@Injectable({
  providedIn: 'root',
})
export class DesignationsService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDesignations(): Observable<DesignationInterface[]> {
    return this.http
      .get<DesignationInterface[]>(`${this.apiUrl}/designations`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Designations Not Found'));
        }),
      );
  }

  public createDesignations(
    designation: CreateDesignationRequest,
  ): Observable<DesignationInterface> {
    return this.http
      .post<DesignationInterface>(`${this.apiUrl}/designations`, designation, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Unable to create designation'));
        }),
      );
  }

  public updateDesignations(
    id: number,
    designation: UpdateDesignationRequest,
  ): Observable<DesignationInterface> {
    return this.http
      .patch<DesignationInterface>(`${this.apiUrl}/designations/${id}`, designation, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Unable to update designation'));
        }),
      );
  }
}
