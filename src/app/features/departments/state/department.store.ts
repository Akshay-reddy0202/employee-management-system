import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Department } from '../interfaces/department.interface';
import { DepartmentsService } from '../services/departments.service';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
import { EmployeeService } from '../../employees/services/employee.service';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';

type DepartmentState = {
  departments: Department[];
  allDepartments: Department[];
  departmentEmployees: EmployeeInterface[];
  departmentsLoading: boolean;
  allDepartmentsLoading: boolean;
  departmentEmployeesLoading: boolean;
  departmentsLoaded: boolean;
  updateSuccess: boolean;
  createSuccess: boolean;
  deleteSuccess: boolean;
  totalDepartments: number;
  currentPage: number;
  pageSize: number;
  error: string | null;
};

const initialState: DepartmentState = {
  departments: [],
  allDepartments: [],
  departmentEmployees: [],
  departmentsLoading: false,
  allDepartmentsLoading: false,
  departmentEmployeesLoading: false,
  departmentsLoaded: false,
  updateSuccess: false,
  createSuccess: false,
  deleteSuccess: false,
  totalDepartments: 0,
  currentPage: 1,
  pageSize: 10,
  error: null,
};

export const DepartmentsStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withComputed((store) => ({
    totalPages: computed(() => Math.ceil(store.totalDepartments() / store.pageSize())),
  })),
  withMethods((store) => {
    const departmentsService = inject(DepartmentsService);
    const employeesService = inject(EmployeeService);
    return {
      loadDepartments() {
        patchState(store, {
          departmentsLoading: true,
          error: null,
        });

        departmentsService.getDepartments(store.currentPage(), store.pageSize()).subscribe({
          next: (response) => {
            patchState(store, {
              departments: response.data,
              totalDepartments: response.totalCount,
              departmentsLoading: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              departmentsLoading: false,
              error: error.message,
            });
          },
        });
      },

      loadAllDepartments(forceRefresh = false) {
        if (store.departmentsLoaded() && !forceRefresh) {
          return;
        }
        patchState(store, {
          allDepartmentsLoading: true,
          error: null,
        });
        departmentsService.getAllDepartments().subscribe({
          next: (departments) => {
            patchState(store, {
              allDepartments: departments,
              error: null,
              allDepartmentsLoading: false,
              departmentsLoaded: true,
            });
          },
          error: (error) => {
            patchState(store, {
              allDepartmentsLoading: false,
              error: error.message,
            });
          },
        });
      },

      createDepartment(request: CreateDepartmentRequest) {
        patchState(store, {
          createSuccess: false,
          error: null,
        });

        departmentsService.createDepartment(request).subscribe({
          next: () => {
            this.loadAllDepartments(true);
            this.loadDepartments();
            patchState(store, {
              createSuccess: true,
            });
          },
          error: (error) => {
            patchState(store, {
              error: error.message,
              createSuccess: false,
            });
          },
        });
      },

      updateDepartment(departmentId: string, request: UpdateDepartmentRequest) {
        patchState(store, {
          updateSuccess: false,
          error: null,
        });
        departmentsService.updateDepartment(departmentId, request).subscribe({
          next: () => {
            this.loadDepartments();
            this.loadAllDepartments(true);
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

      deleteDepartment(departmentId: string) {
        patchState(store, {
          deleteSuccess: false,
          error: null,
        });

        departmentsService.deleteDepartment(departmentId).subscribe({
          next: () => {
            this.refresh();
            patchState(store, {
              deleteSuccess: true,
            });
          },
          error: (error) => {
            patchState(store, {
              error: error.message,
              deleteSuccess: false,
            });
          },
        });
      },

      loadEmployeeByDepartment(departmentId: string) {
        patchState(store, {
          departmentEmployeesLoading: true,
          error: null,
        });

        employeesService.getEmployeesByDepartment(departmentId).subscribe({
          next: (employees) => {
            patchState(store, {
              departmentEmployees: employees,
              departmentEmployeesLoading: false,
            });
          },
          error: (error) => {
            patchState(store, {
              departmentEmployeesLoading: false,
              error: error.message,
            });
          },
        });
      },
      
      refresh() {
        this.loadAllDepartments(true);
        this.loadDepartments();
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

      clearCreateSuccess() {
        patchState(store, {
          createSuccess: false,
        });
      },

      clearDeleteSuccess() {
        patchState(store, {
          deleteSuccess: false,
        });
      },

      clearDepartmentEmployees() {
        patchState(store, {
          departmentEmployees: [],
        });
      },
    };
  }),
);
