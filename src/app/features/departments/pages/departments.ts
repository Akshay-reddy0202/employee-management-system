import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { DepartmentTable } from '../components/department-table/department-table';
import { DepartmentForm } from '../components/department-form/department-form';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { Department } from '../interfaces/department.interface';
import { ToastrService } from 'ngx-toastr';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { DepartmentSortColumn, SortDirection } from '../interfaces/department-sort.type';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Modal } from '../../../shared/components/modal/modal';
import { DepartmentEmployees } from '../components/department-employees/department-employees';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { DepartmentsStore } from '../state/department.store';

@Component({
  selector: 'app-departments',
  imports: [
    DepartmentTable,
    DepartmentForm,
    Modal,
    ConfirmationDialog,
    EmptyState,
    MatIconModule,
    DepartmentEmployees,
    Pagination,
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
  private readonly departmentsStore = inject(DepartmentsStore);
  protected readonly departments = this.departmentsStore.departments;
  protected readonly departmentEmployees = this.departmentsStore.departmentEmployees;

  protected readonly error = this.departmentsStore.error;
  protected readonly createSuccess = this.departmentsStore.createSuccess;
  protected readonly updateSuccess = this.departmentsStore.updateSuccess;
  protected readonly deleteSuccess = this.departmentsStore.deleteSuccess;
  protected readonly departmentEmployeesLoading = this.departmentsStore.departmentEmployeesLoading;

  protected readonly totalDepartments = this.departmentsStore.totalDepartments;
  protected readonly currentPage = this.departmentsStore.currentPage;
  protected readonly pageSize = this.departmentsStore.pageSize;
  protected readonly totalPages = this.departmentsStore.totalPages;

  protected readonly isDepartmentFormOpen = signal(false);
  private readonly toastr = inject(ToastrService);
  protected readonly selectedDepartment = signal<Department | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly isConfirmationDialogOpen = signal(false);
  protected readonly sortColumn = signal<DepartmentSortColumn | null>(null);
  protected readonly sortDirection = signal<SortDirection | null>(null);
  protected readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isUnsavedChangesDialogOpen = signal(false);

  protected readonly isEmployeesDialogOpen = signal(false);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value);
      });

    effect(() => {
      const error = this.error();

      if (error) {
        this.isSubmitting.set(false);
        this.toastr.error(error);
      }

      if (this.createSuccess()) {
        this.isSubmitting.set(false);
        this.toastr.success('Department created successfully');
        this.closeDepartmentForm();
        this.departmentsStore.clearCreateSuccess();
      }

      if (this.updateSuccess()) {
        this.isSubmitting.set(false);
        this.toastr.success('Department updated successfully');
        this.closeDepartmentForm();
        this.departmentsStore.clearUpdateSuccess();
      }

      if (this.deleteSuccess()) {
        this.toastr.success('Department deleted successfully');
        this.closeDeleteConfirmationDialog();
        this.departmentsStore.clearDeleteSuccess();
      }
    });
  }

  ngOnInit(): void {
    this.departmentsStore.loadDepartments();
  }

  protected refreshDepartments(): void {
    this.departmentsStore.refresh();
  }

  protected readonly sortedDepartments = computed(() => {
    const departments = [...this.searchedDepartments()];
    const column = this.sortColumn()!;
    const direction = this.sortDirection()!;
    if (!this.sortColumn() || !this.sortDirection()) {
      return departments;
    }

    departments.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      let comparison = valueA.localeCompare(valueB);

      if (direction === 'desc') {
        comparison *= -1;
      }
      return comparison;
    });
    return departments;
  });

  protected onSort(column: DepartmentSortColumn): void {
    if (this.sortColumn() !== column) {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');

      return;
    }
    switch (this.sortDirection()) {
      case 'asc':
        this.sortDirection.set('desc');
        break;

      case 'desc':
        this.sortColumn.set(null);
        this.sortDirection.set(null);
        break;

      default:
        this.sortDirection.set('asc');
        break;
    }
  }

  protected onUnsavedChangesDialog(): void {
    this.isUnsavedChangesDialogOpen.set(true);
  }

  protected continueEditing(): void {
    this.isUnsavedChangesDialogOpen.set(false);
  }

  protected discardChanges(): void {
    this.isUnsavedChangesDialogOpen.set(false);
    this.closeDepartmentForm();
  }

  protected readonly hasDepartments = computed(() => {
    return this.departments().length > 0;
  });

  protected openCreateDepartmentForm(): void {
    this.selectedDepartment.set(null);
    this.isDepartmentFormOpen.set(true);
  }

  protected closeDepartmentForm(): void {
    this.selectedDepartment.set(null);
    this.isDepartmentFormOpen.set(false);
  }

  protected onEditDepartment(department: Department): void {
    this.openEditDepartmentForm(department);
  }

  protected openEditDepartmentForm(department: Department): void {
    this.selectedDepartment.set(department);
    this.isDepartmentFormOpen.set(true);
  }

  protected openDeleteConfirmationDialog(department: Department): void {
    this.selectedDepartment.set(department);
    this.isConfirmationDialogOpen.set(true);
  }

  protected closeDeleteConfirmationDialog(): void {
    this.isConfirmationDialogOpen.set(false);
    this.selectedDepartment.set(null);
  }

  protected onPageChange(page: number): void {
    this.departmentsStore.setCurrentPage(page);
    this.departmentsStore.loadDepartments();
  }

  private departmentCodeExists(code: string, ignoreDepartmentId?: string): boolean {
    return this.departments().some((department) => {
      const isSameCode = department.code.trim().toLowerCase() === code.trim().toLowerCase();

      const isDifferentDepartment = department.id !== ignoreDepartmentId;

      return isSameCode && isDifferentDepartment;
    });
  }

  protected save(request: CreateDepartmentRequest): void {
    if (this.selectedDepartment()) {
      this.updateDepartment(request);
    } else {
      this.createDepartment(request);
    }
  }

  private createDepartment(request: CreateDepartmentRequest): void {
    if (this.departmentCodeExists(request.code)) {
      this.toastr.error('Department code already exists');
      return;
    }
    this.isSubmitting.set(true);

    this.departmentsStore.createDepartment(request);
  }

  private updateDepartment(request: UpdateDepartmentRequest): void {
    const selectedDepartment = this.selectedDepartment();

    if (!selectedDepartment) {
      return;
    }

    if (this.departmentCodeExists(request.code, selectedDepartment.id)) {
      this.toastr.error('Department code already exists');
      return;
    }
    this.isSubmitting.set(true);

    this.departmentsStore.updateDepartment(selectedDepartment.id, request);
  }

  protected confirmDeleteDepartment(): void {
    const department = this.selectedDepartment();
    if (!department) {
      return;
    }
    this.departmentsStore.deleteDepartment(department.id);
  }

  protected readonly searchedDepartments = computed(() => {
    const departments = this.departments();
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) {
      return departments;
    }

    return departments.filter((department) => {
      const name = department.name.toLowerCase();
      const code = department.code.toLowerCase();

      return name.includes(search) || code.includes(search);
    });
  });

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  protected onViewEmployees(department: Department): void {
    this.departmentsStore.loadEmployeeByDepartment(department.id);
    this.isEmployeesDialogOpen.set(true);
  }

  protected onDepartmentEmployeesTableClose(): void {
    this.isEmployeesDialogOpen.set(false);
    this.departmentsStore.clearDepartmentEmployees();
  }
}
