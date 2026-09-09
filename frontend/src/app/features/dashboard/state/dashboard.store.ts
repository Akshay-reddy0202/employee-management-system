import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { EChartsCoreOption } from 'echarts/core';
import {
  DashboardData,
  DashboardService,
  DashboardSummary,
  DepartmentDistributionItem,
  EmployeeGrowthItem,
  RecentEmployeeItem,
} from '../services/dashboard.service';

export interface DashboardState {
  summary: DashboardSummary | null;
  departmentDistribution: DepartmentDistributionItem[];
  employeeGrowth: EmployeeGrowthItem[];
  recentEmployees: RecentEmployeeItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  departmentDistribution: [],
  employeeGrowth: [],
  recentEmployees: [],
  loading: false,
  loaded: false,
  error: null,
};

export const DashboardStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed((store) => ({
    totalEmployees: computed(() => store.summary()?.totalEmployees ?? 0),
    totalDepartments: computed(() => store.summary()?.totalDepartments ?? 0),
    activeEmployees: computed(() => store.summary()?.totalActiveEmployees ?? 0),
    totalSalary: computed(() => store.summary()?.totalSalary ?? null),

    activeEmployeesPercentage: computed(() => {
      const summary = store.summary();
      if (!summary || !summary.totalEmployees) {
        return 0;
      }
      return Number(((summary.totalActiveEmployees / summary.totalEmployees) * 100).toFixed(1));
    }),

    employeeGrowthPercentage: computed(() => {
      const growth = store.employeeGrowth();
      if (growth.length < 2) {
        return 0;
      }
      const current = growth[growth.length - 1].employees;
      const previous = growth[growth.length - 2].employees;
      if (previous === 0) {
        return 0;
      }
      return Math.round(((current - previous) / previous) * 100);
    }),

    departmentChartOptions: computed<EChartsCoreOption>(() => {
      const distribution = store.departmentDistribution();
      const total = distribution.reduce((sum, item) => sum + item.employeeCount, 0);

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
            const count = item?.employeeCount ?? 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            return `${name} (${count} - ${percentage}%)`;
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
              value: item.employeeCount,
            })),
          },
        ],
      };
    }),

    employeeGrowthChartOptions: computed<EChartsCoreOption>(() => {
      const growth = store.employeeGrowth();
      const categories = growth.map((item) => {
        const d = new Date(item.month);
        return isNaN(d.getTime())
          ? item.month
          : d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      });

      return {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: categories,
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
            data: growth.map((item) => item.employees),
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
  })),
  withMethods((store) => {
    const dashboardService = inject(DashboardService);

    return {
      loadDashboard(forceRefresh = false) {
        if (store.loaded() && !forceRefresh) {
          return;
        }

        patchState(store, {
          loading: true,
          error: null,
        });

        dashboardService.getDashboardData().subscribe({
          next: (data: DashboardData) => {
            patchState(store, {
              summary: data.summary,
              departmentDistribution: data.departmentDistribution ?? [],
              employeeGrowth: data.employeeGrowth ?? [],
              recentEmployees: data.recentEmployees ?? [],
              loading: false,
              loaded: true,
              error: null,
            });
          },
          error: (error: Error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
          },
        });
      },

      refresh() {
        this.loadDashboard(true);
      },
    };
  }),
);
