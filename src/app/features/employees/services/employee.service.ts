import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { EmployeeInterface } from '../interfaces/employee.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getEmployees(): Observable<EmployeeInterface[]> {
    return this.http.get<EmployeeInterface[]>(`${this.apiUrl}/employees`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('No Employees Found'));
      }),
    );
  }
}
