import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { DashboardStore } from '../../state/dashboard.store';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  protected readonly dashboardStore = inject(DashboardStore);

  protected readonly totalEmployees = this.dashboardStore.totalEmployees;
  protected readonly totalDepartments = this.dashboardStore.totalDepartments;
  protected readonly activeEmployees = this.dashboardStore.activeEmployees;
  protected readonly totalSalary = this.dashboardStore.totalSalary;

  protected readonly recentEmployees = this.dashboardStore.recentEmployees;
  protected readonly departmentDistribution = this.dashboardStore.departmentDistribution;
  protected readonly employeeGrowth = this.dashboardStore.employeeGrowth;
  protected readonly employeeGrowthPercentage = this.dashboardStore.employeeGrowthPercentage;
  protected readonly activeEmployeesPercentage = this.dashboardStore.activeEmployeesPercentage;

  protected readonly departmentChartOptions = this.dashboardStore.departmentChartOptions;
  protected readonly employeeGrowthChartOptions = this.dashboardStore.employeeGrowthChartOptions;

  ngOnInit(): void {
    this.dashboardStore.loadDashboard();
  }
}
