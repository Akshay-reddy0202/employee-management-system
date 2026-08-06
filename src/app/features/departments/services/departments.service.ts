import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { Department } from '../interfaces/department.interface';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDepartments(): Observable<Department[]> {
    return this.http
      .get<Department[]>(`${this.apiUrl}/departments`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Departments Not Found'));
        }),
      );
  }

  public createDepartment(request: CreateDepartmentRequest): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments`, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Unable to create department'));
      }),
    );
  }

  public updateDepartment(id: number, request: UpdateDepartmentRequest): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/departments/${id}`, request).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Unable to update department'));
      }),
    );
  }

  public deleteDepartment(id: number): Observable<Department> {
    return this.http
      .delete<Department>(`${this.apiUrl}/departments/${id}`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('unable to delete the department'));
        }),
      );
  }
}
