import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EmployeeInterface } from '../interfaces/employee.model';
import { environment } from '../../../../environments/environment';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getEmployees(): Observable<EmployeeInterface[]> {
    return this.http
      .get<EmployeeInterface[]>(`${this.apiUrl}/employees`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('No Employees Found'));
        }),
      );
  }

  public updateEmployee(id: string, request: UpdateEmployeeRequest): Observable<EmployeeInterface> {
    return this.http
      .patch<EmployeeInterface>(`${this.apiUrl}/employees/${id}`, request, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Unable to update employee'));
        }),
      );
  }

  public getEmployeesByDepartment(departmentId: string): Observable<EmployeeInterface[]> {
    return this.http.get<EmployeeInterface[]>(`${this.apiUrl}/employees?departmentId=${departmentId}`);
  }
}
