import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SHOW_LOADER } from '../../../core/interceptors/loading-token.interceptor';
import { AuthApiResponse } from '../../auth/models/login-response.model';

export interface DashboardSummary {
  totalEmployees: number;
  totalActiveEmployees: number;
  totalDepartments: number;
  totalSalary?: number;
}

export interface DepartmentDistributionItem {
  id: string;
  name: string;
  employeeCount: number;
}

export interface EmployeeGrowthItem {
  month: string;
  employees: number;
}

export interface RecentEmployeeItem {
  id: string;
  employeeId: string;
  fullName: string;
  joiningDate: string | null;
  salary?: number | null;
  status?: string | null;
  department?: { name: string } | null;
  designation?: { name: string } | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  departmentDistribution: DepartmentDistributionItem[];
  employeeGrowth: EmployeeGrowthItem[];
  recentEmployees: RecentEmployeeItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  public getDashboardData(): Observable<DashboardData> {
    return this.http
      .get<AuthApiResponse<DashboardData>>(`${this.apiUrl}/dashboard`, {
        context: new HttpContext().set(SHOW_LOADER, true),
      })
      .pipe(
        map((response) => response.data),
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || error.message || 'Failed to load dashboard data';
          return throwError(() => new Error(message));
        }),
      );
  }
}
