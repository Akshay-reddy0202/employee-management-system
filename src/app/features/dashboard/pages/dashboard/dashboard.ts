import { Component, inject, signal } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EmployeeStore } from '../../../employees/state/employee.store';
import { DepartmentsStore } from '../../../departments/state/department.store';
import { DashboardStore } from '../../state/dashboard.store';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard {
  private readonly dashboardStore = inject(DashboardStore);
  private readonly employeeStore = inject(EmployeeStore);
  private readonly departmentsStore = inject(DepartmentsStore);

  protected readonly employees = this.employeeStore.allEmployees;
  protected readonly departments = this.departmentsStore.allDepartments;

  protected readonly totalDepartments = this.departmentsStore.totalDepartments;

  protected readonly totalEmployees = this.employeeStore.totalEmployees;
  protected readonly activeEmployees = this.employeeStore.activeEmployees;
  protected readonly totalSalary = this.employeeStore.totalSalaryExpense;

  protected readonly recentEmployees = this.dashboardStore.recentEmployees;
  protected readonly departmentDistribution = this.dashboardStore.departmentDistribution;
  protected readonly employeeGrowth = this.dashboardStore.employeeGrowth;
  protected readonly employeeGrowthPercentage = this.dashboardStore.employeeGrowthPercentage;
  protected readonly activeEmployeesPercentage = this.dashboardStore.activeEmployeesPercentage;

  protected readonly departmentChartOptions = this.dashboardStore.departmentChartOptions;
  protected readonly employeeGrowthChartOptions = this.dashboardStore.employeeGrowthChartOptions;

  ngOnInit(): void {
    this.employeeStore.loadAllEmployees();
    this.departmentsStore.loadAllDepartments();
  }

  protected getDepartmentName(departmentId: string | null | undefined): string {
    const department = this.departments().find((department) => department.id === departmentId);
    return department?.name ?? '-';
  }
}
