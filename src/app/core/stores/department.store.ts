import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Department } from '../../features/departments/interfaces/department.interface';
import { computed, inject } from '@angular/core';
import { DepartmentsService } from '../../features/departments/services/departments.service';
import { CreateDepartmentRequest } from '../../features/departments/interfaces/create-department-request.interface';
import { UpdateDepartmentRequest } from '../../features/departments/interfaces/update-department-request.interface';

type DepartmentState = {
  departments: Department[];
  allDepartments: Department[];
  departmentsLoading: boolean;
  allDepartmentsLoading: boolean;
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
  departmentsLoading: false,
  allDepartmentsLoading: false,
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

      loadAllDepartments() {
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
            this.loadAllDepartments();
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
            this.loadAllDepartments();
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

      refresh() {
        this.loadAllDepartments();
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
    };
  }),
);
