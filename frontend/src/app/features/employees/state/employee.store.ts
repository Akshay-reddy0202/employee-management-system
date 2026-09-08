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
  allEmployeesLoaded: boolean;
  updateSuccess: boolean;
  error: string | null;
  totalEmployees: number;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  selectedDepartmentId: string;
  selectedDesignationId: string;
};

const initialState: EmployeeState = {
  employees: [],
  allEmployees: [],
  employeesLoading: false,
  allEmployeesLoading: false,
  employeesLoaded: false,
  allEmployeesLoaded: false,
  updateSuccess: false,
  error: null,
  totalEmployees: 0,
  currentPage: 1,
  pageSize: 10,
  searchTerm: '',
  selectedDepartmentId: '',
  selectedDesignationId: '',
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
      loadEmployees(forceRefresh = false) {
        if (store.employeesLoaded() && !forceRefresh) {
          return;
        }

        patchState(store, {
          employeesLoading: true,
          error: null,
        });

        employeeService
          .getEmployees({
            page: store.currentPage(),
            pageSize: store.pageSize(),
            search: store.searchTerm(),
            departmentId: store.selectedDepartmentId(),
            designationId: store.selectedDesignationId(),
          })
          .subscribe({
            next: (response) => {
              patchState(store, {
                employees: response.data,
                totalEmployees: response.totalCount,
                employeesLoaded: true,
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
        if (store.allEmployeesLoaded() && !forceRefresh) {
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
              allEmployeesLoaded: true,
              error: null,
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
          next: (updatedEmployee) => {
            this.loadEmployees(true);
            const updatedAll = store.allEmployees().map((emp) =>
              emp.id === employeeId ? { ...emp, ...updatedEmployee } : emp,
            );
            patchState(store, {
              allEmployees: updatedAll,
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

      setSearchTerm(searchTerm: string) {
        patchState(store, { searchTerm, currentPage: 1 });
        this.loadEmployees(true);
      },

      setDepartmentFilter(selectedDepartmentId: string) {
        patchState(store, { selectedDepartmentId, currentPage: 1 });
        this.loadEmployees(true);
      },

      setDesignationFilter(selectedDesignationId: string) {
        patchState(store, { selectedDesignationId, currentPage: 1 });
        this.loadEmployees(true);
      },

      setCurrentPage(page: number) {
        patchState(store, { currentPage: page });
        this.loadEmployees(true);
      },

      setPageSize(pageSize: number) {
        patchState(store, { pageSize, currentPage: 1 });
        this.loadEmployees(true);
      },

      clearUpdateSuccess() {
        patchState(store, {
          updateSuccess: false,
        });
      },

      refresh() {
        this.loadEmployees(true);
        if (store.allEmployeesLoaded()) {
          this.loadAllEmployees(true);
        }
      },
    };
  }),
);
