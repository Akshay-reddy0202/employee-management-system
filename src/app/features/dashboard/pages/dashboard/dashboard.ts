import { Component, inject, signal } from '@angular/core';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
import { EmployeeService } from '../../../employees/services/employee.service';
import { Department } from '../../../departments/interfaces/department.interface';
import { DepartmentsService } from '../../../departments/services/departments.service';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts/core';
import { EmployeeStore } from '../../../../core/stores/employee.store';

@Component({
  selector: 'app-dashboard',
  imports: [NgxEchartsDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly employeesService = inject(EmployeeService);
  private readonly employeeStore = inject(EmployeeStore);
  protected readonly employees = signal<EmployeeInterface[]>([]);
  protected readonly totalEmployees = signal(0);
  protected readonly activeEmployees = signal(0);
  protected readonly totalSalary = signal(0);
  protected readonly recentEmployees = signal<EmployeeInterface[]>([]);
  private readonly departmentsService = inject(DepartmentsService);
  protected readonly departments = signal<Department[]>([]);
  protected readonly totalDepartments = signal(0);
  protected readonly departmentDistribution = signal<{ name: string; count: number }[]>([]);
  protected readonly departmentChartOptions = signal<EChartsCoreOption>({});
  protected readonly employeeGrowth = signal<{ month: string; count: number }[]>([]);
  protected readonly employeeGrowthChartOptions = signal({});
  protected readonly employeeGrowthPercentage = signal(0);
  protected readonly activeEmployeesPercentage = signal(0);

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees(1, 1000).subscribe({
      next: (response) => {
        const employees = response.data;
        this.employees.set(employees);
        this.totalEmployees.set(response.totalCount);
        this.calculateEmployeeGrowth();

        const activeEmployees = this.employees().filter(
          (employee) => employee.status === 'Active',
        ).length;
        this.activeEmployees.set(activeEmployees);
        this.activeEmployeesPercentage.set(
          Number(((activeEmployees / employees.length) * 100).toFixed(1)),
        );

        this.totalSalary.set(
          employees.reduce((total, employee) => total + (employee.salary ?? 0), 0),
        );

        const recentEmployees = [...employees]
          .sort(
            (a, b) =>
              new Date(b.joiningDate ?? '').getTime() - new Date(a.joiningDate ?? '').getTime(),
          )
          .slice(0, 5);
        this.recentEmployees.set(recentEmployees);
        this.calculateDepartmentDistribution();
      },
    });
  }

  private loadDepartments(): void {
    this.departmentsService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
        this.totalDepartments.set(departments.length);
        this.calculateDepartmentDistribution();
      },
    });
  }

  protected getDepartmentName(departmentId: string | null | undefined): string {
    const department = this.departments().find((department) => department.id === departmentId);
    return department?.name ?? '-';
  }

  private calculateDepartmentDistribution(): void {
    if (!this.departments().length || !this.employees().length) {
      return;
    }
    const distribution = this.departments().map((department) => ({
      name: department.name,
      count: this.employees().filter((employee) => employee.departmentId == department.id).length,
    }));
    this.departmentDistribution.set(distribution);
    this.departmentChartOptions.set({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: '55%',
        top: 'center',
        formatter: (name: string) => {
          const item = distribution.find((d) => d.name === name);

          const total = distribution.reduce((sum, department) => sum + department.count, 0);

          const percentage = Math.round(((item?.count ?? 0) / total) * 100);

          return `${name}       (${item?.count ?? 0} - ${percentage}%)`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['25%', '50%'],
          avoidLabelOverlap: true,

          label: {
            show: false,
          },

          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },

          data: distribution.map((item) => ({
            name: item.name,
            value: item.count,
          })),
        },
      ],
    });
  }

  private calculateEmployeeGrowth(): void {
    const monthlyCounts = new Map<string, number>();

    this.employees().forEach((employee) => {
      if (!employee.joiningDate) {
        return;
      }
      const date = new Date(employee.joiningDate);

      const month = date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      monthlyCounts.set(month, (monthlyCounts.get(month) ?? 0) + 1);
    });

    let runningTotal = 0;

    const growthData = Array.from(monthlyCounts.entries()).map(([month, count]) => {
      runningTotal += count;

      return {
        month,
        count: runningTotal,
      };
    });

    this.employeeGrowth.set(growthData);
    this.buildEmployeeGrowthChart();

    if (growthData.length >= 2) {
      const currentMonth = growthData[growthData.length - 1];
      const previousMonth = growthData[growthData.length - 2];

      const percentage = ((currentMonth.count - previousMonth.count) / previousMonth.count) * 100;

      this.employeeGrowthPercentage.set(Math.round(percentage));
    }
  }

  private buildEmployeeGrowthChart(): void {
    const growthData = this.employeeGrowth();

    this.employeeGrowthChartOptions.set({
      tooltip: {
        trigger: 'axis',
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: growthData.map((item) => item.month),
      },

      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'Employees',
          type: 'line',
          smooth: true,

          data: growthData.map((item) => item.count),

          showSymbol: true,
          symbolSize: 8,

          lineStyle: {
            width: 3,
          },

          areaStyle: {
            opacity: 0.2,
          },
        },
      ],
    });
  }
}
