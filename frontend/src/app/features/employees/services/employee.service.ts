import { HttpClient, HttpContext, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EmployeeInterface } from '../interfaces/employee.model';
import { environment } from '../../../../environments/environment';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { PaginationResult } from '../../../core/models/paginated-result.interface';

export interface GetEmployeesParams {
  page: number;
  pageSize: number;
  search?: string;
  departmentId?: string;
  designationId?: string;
}

interface EmployeeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  page?: number;
  pageSize?: number;
  totalCount?: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getEmployees(
    params: GetEmployeesParams,
  ): Observable<PaginationResult<EmployeeInterface>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.search?.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }
    if (params.departmentId?.trim()) {
      httpParams = httpParams.set('departmentId', params.departmentId.trim());
    }
    if (params.designationId?.trim()) {
      httpParams = httpParams.set('designationId', params.designationId.trim());
    }

    return this.http
      .get<EmployeeApiResponse<EmployeeInterface[]>>(`${this.apiUrl}/employees`, {
        params: httpParams,
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => ({
          data: response.data,
          totalCount: response.totalCount ?? response.data.length,
        })),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'No Employees Found';
          return throwError(() => new Error(message));
        }),
      );
  }

  public updateEmployee(id: string, request: UpdateEmployeeRequest): Observable<EmployeeInterface> {
    const payload: Record<string, any> = {};
    if (request.departmentId) payload['departmentId'] = request.departmentId;
    if (request.designationId) payload['designationId'] = request.designationId;
    if (request.managerId !== undefined) payload['managerId'] = request.managerId;
    if (request.salary !== null && request.salary !== undefined && request.salary > 0) payload['salary'] = request.salary;
    if (request.status) payload['status'] = request.status;
    if (request.joiningDate) payload['joiningDate'] = request.joiningDate;

    return this.http
      .patch<EmployeeApiResponse<EmployeeInterface>>(`${this.apiUrl}/employees/${id}`, payload, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Unable to update employee';
          return throwError(() => new Error(message));
        }),
      );
  }

  public getAllEmployees(): Observable<EmployeeInterface[]> {
    return this.http
      .get<EmployeeApiResponse<EmployeeInterface[]>>(`${this.apiUrl}/employees?pageSize=100`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Employees not Found';
          return throwError(() => new Error(message));
        }),
      );
  }
}
