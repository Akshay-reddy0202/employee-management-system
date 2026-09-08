import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { Department } from '../interfaces/department.interface';
import { DepartmentsService } from '../services/departments.service';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
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

    const slicePage = (items: Department[], page: number, pageSize: number): Department[] => {
      const start = (page - 1) * pageSize;
      return items.slice(start, start + pageSize);
    };

    return {
      loadDepartments(forceRefresh = false) {
        if (store.departmentsLoaded() && !forceRefresh) {
          patchState(store, {
            departments: slicePage(store.allDepartments(), store.currentPage(), store.pageSize()),
            totalDepartments: store.allDepartments().length,
            departmentsLoading: false,
            error: null,
          });
          return;
        }

        patchState(store, {
          departmentsLoading: true,
          error: null,
        });

        departmentsService.getAllDepartments().subscribe({
          next: (departments) => {
            const maxPage = Math.max(1, Math.ceil(departments.length / store.pageSize()));
            const currentPage = Math.min(store.currentPage(), maxPage);
            patchState(store, {
              allDepartments: departments,
              departments: slicePage(departments, currentPage, store.pageSize()),
              totalDepartments: departments.length,
              currentPage,
              departmentsLoading: false,
              departmentsLoaded: true,
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
            const maxPage = Math.max(1, Math.ceil(departments.length / store.pageSize()));
            const currentPage = Math.min(store.currentPage(), maxPage);
            patchState(store, {
              allDepartments: departments,
              departments: slicePage(departments, currentPage, store.pageSize()),
              totalDepartments: departments.length,
              currentPage,
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
            this.loadDepartments(true);
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
            this.loadDepartments(true);
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

        departmentsService.getDepartmentById(departmentId).subscribe({
          next: (department) => {
            const employees = (department.employees || []).map((emp) => ({
              id: emp.id,
              employeeId: emp.employeeId,
              fullName: emp.fullName,
            })) as EmployeeInterface[];

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
        this.loadDepartments(true);
      },

      setCurrentPage(page: number) {
        patchState(store, {
          currentPage: page,
          departments: slicePage(store.allDepartments(), page, store.pageSize()),
        });
      },

      setPageSize(pageSize: number) {
        const maxPage = Math.max(1, Math.ceil(store.totalDepartments() / pageSize));
        const currentPage = Math.min(store.currentPage(), maxPage);
        patchState(store, {
          pageSize,
          currentPage,
          departments: slicePage(store.allDepartments(), currentPage, pageSize),
        });
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
