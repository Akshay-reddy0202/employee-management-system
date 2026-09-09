import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Department } from '../interfaces/department.interface';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { PaginationResult } from '../../../core/models/paginated-result.interface';
import { AuthApiResponse } from '../../auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDepartments(page: number, limit: number): Observable<PaginationResult<Department>> {
    return this.getAllDepartments().pipe(
      map((departments) => {
        const start = (page - 1) * limit;
        return {
          data: departments.slice(start, start + limit),
          totalCount: departments.length,
        };
      }),
    );
  }

  public getAllDepartments(): Observable<Department[]> {
    return this.http
      .get<AuthApiResponse<Department[]>>(`${this.apiUrl}/departments`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Departments Not Found';
          return throwError(() => new Error(message));
        }),
      );
  }

  public getDepartmentById(id: string): Observable<Department> {
    return this.http
      .get<AuthApiResponse<Department>>(`${this.apiUrl}/departments/${id}`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Department Not Found';
          return throwError(() => new Error(message));
        }),
      );
  }

  public createDepartment(request: CreateDepartmentRequest): Observable<Department> {
    return this.http
      .post<AuthApiResponse<Department>>(`${this.apiUrl}/departments`, request, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to create department';
          return throwError(() => new Error(message));
        }),
      );
  }

  public updateDepartment(id: string, request: UpdateDepartmentRequest): Observable<Department> {
    return this.http
      .patch<AuthApiResponse<Department>>(`${this.apiUrl}/departments/${id}`, request, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to update department';
          return throwError(() => new Error(message));
        }),
      );
  }

  public deleteDepartment(id: string): Observable<void> {
    return this.http
      .delete<AuthApiResponse<void>>(`${this.apiUrl}/departments/${id}`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map(() => undefined),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to delete the department';
          return throwError(() => new Error(message));
        }),
      );
  }
}
