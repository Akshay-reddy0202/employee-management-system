import { computed, inject } from '@angular/core';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { EmployeeStore } from '../../employees/state/employee.store';
import { DepartmentsStore } from '../../departments/state/department.store';
import { EChartsCoreOption } from 'echarts/core';
import { Department } from '../../departments/interfaces/department.interface';

const initialState = {};

const getEmployeeGrowth = (employees: EmployeeInterface[]) => {
  const monthlyCounts = new Map<string, number>();

  employees.forEach((employee) => {
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

  return Array.from(monthlyCounts.entries()).map(([month, count]) => {
    runningTotal += count;

    return {
      month,
      count: runningTotal,
    };
  });
};

function getDepartmentDistribution(departments: Department[], employees: EmployeeInterface[]) {
  return departments.map((department) => ({
    name: department.name,
    count: employees.filter((employee) => employee.departmentId === department.id).length,
  }));
}

export const DashboardStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed(() => {
    const employeeStore = inject(EmployeeStore);
    const departmentsStore = inject(DepartmentsStore);

    return {
      recentEmployees: computed(() => {
        return [...employeeStore.allEmployees()]
          .sort(
            (a, b) =>
              new Date(b.joiningDate ?? '').getTime() - new Date(a.joiningDate ?? '').getTime(),
          )
          .slice(0, 5);
      }),

      activeEmployeesPercentage: computed(() => {
        const employees = employeeStore.allEmployees();

        if (!employees.length) {
          return 0;
        }

        const activeEmployees = employees.filter((employee) => employee.status === 'Active').length;

        return Number(((activeEmployees / employees.length) * 100).toFixed(1));
      }),

      departmentDistribution: computed(() =>
        getDepartmentDistribution(departmentsStore.allDepartments(), employeeStore.allEmployees()),
      ),

      employeeGrowth: computed(() => {
        return getEmployeeGrowth(employeeStore.allEmployees());
      }),

      employeeGrowthPercentage: computed(() => {
        const growthData = getEmployeeGrowth(employeeStore.allEmployees());

        if (growthData.length < 2) {
          return 0;
        }

        const currentMonth = growthData[growthData.length - 1];
        const previousMonth = growthData[growthData.length - 2];

        if (previousMonth.count === 0) {
          return 0;
        }

        return Math.round(((currentMonth.count - previousMonth.count) / previousMonth.count) * 100);
      }),

      departmentChartOptions: computed<EChartsCoreOption>(() => {
        const distribution = getDepartmentDistribution(
          departmentsStore.allDepartments(),
          employeeStore.allEmployees(),
        );

        return {
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

              return `${name} (${item?.count ?? 0} - ${percentage}%)`;
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
        };
      }),

      employeeGrowthChartOptions: computed<EChartsCoreOption>(() => {
        const growthData = getEmployeeGrowth(employeeStore.allEmployees());

        return {
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
        };
      }),
    };
  }),
);
