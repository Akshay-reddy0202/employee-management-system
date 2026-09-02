import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { EmployeeInterface } from '../interfaces/employee.model';
import { computed, inject } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';

type EmployeeState = {
  employees: EmployeeInterface[];
  allEmployees: EmployeeInterface[];
  employeesLoading: boolean;
  allEmployeesLoading: boolean;
  employeesLoaded: boolean;
  updateSuccess: boolean;
  error: string | null;
  totalEmployees: number;
  currentPage: number;
  pageSize: number;
};

const initialState: EmployeeState = {
  employees: [],
  allEmployees: [],
  employeesLoading: false,
  allEmployeesLoading: false,
  employeesLoaded: false,
  updateSuccess: false,
  error: null,
  totalEmployees: 0,
  currentPage: 1,
  pageSize: 10,
};

export const EmployeeStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed((store) => ({
    totalPages: computed(() => Math.ceil(store.totalEmployees() / store.pageSize())),

    activeEmployees: computed(
      () => store.allEmployees().filter((employee) => employee.status === 'Active').length,
    ),

    inActiveEmployees: computed(
      () => store.allEmployees().filter((employee) => employee.status === 'Inactive').length,
    ),

    totalSalaryExpense: computed(() =>
      store.allEmployees().reduce((total, employee) => total + (employee.salary ?? 0), 0),
    ),
  })),

  withMethods((store) => {
    const employeeService = inject(EmployeeService);
    return {
      loadEmployees() {
        patchState(store, {
          employeesLoading: true,
          error: null,
        });

        employeeService.getEmployees(store.currentPage(), store.pageSize()).subscribe({
          next: (response) => {
            patchState(store, {
              employees: response.data,
              totalEmployees: response.totalCount,
              employeesLoading: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              employeesLoading: false,
              error: error.message,
            });
          },
        });
      },

      loadAllEmployees(forceRefresh = false) {
        if (store.employeesLoaded() && !forceRefresh) {
          return;
        }
        patchState(store, {
          allEmployeesLoading: true,
          error: null,
        });
        employeeService.getAllEmployees().subscribe({
          next: (employees) => {
            patchState(store, {
              allEmployees: employees,
              totalEmployees: employees.length,
              error: null,
              employeesLoaded: true,
              allEmployeesLoading: false,
            });
          },
          error: (error) => {
            patchState(store, {
              allEmployeesLoading: false,
              error: error.message,
            });
          },
        });
      },

      updateEmployee(employeeId: string, request: UpdateEmployeeRequest) {
        patchState(store, {
          updateSuccess: false,
          error: null,
        });
        employeeService.updateEmployee(employeeId, request).subscribe({
          next: () => {
            this.loadEmployees();
            this.loadAllEmployees(true);
            patchState(store, {
              updateSuccess: true,
            });
          },
          error: (error) => {
            patchState(store, {
              error: error.message,
              updateSuccess: false,
            });
          },
        });
      },

      setCurrentPage(page: number) {
        patchState(store, { currentPage: page });
      },

      setPageSize(pageSize: number) {
        patchState(store, { pageSize });
      },

      clearUpdateSuccess() {
        patchState(store, {
          updateSuccess: false,
        });
      },

      refresh() {
        this.loadAllEmployees(true);
        this.loadEmployees();
      },
    };
  }),
);
