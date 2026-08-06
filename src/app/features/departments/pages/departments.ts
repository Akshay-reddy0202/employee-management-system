import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { DepartmentModal } from '../components/department-modal/department-modal';
import { DepartmentTable } from '../components/department-table/department-table';
import { DepartmentForm } from '../components/department-form/department-form';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../interfaces/department.interface';
import { ToastrService } from 'ngx-toastr';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { DepartmentSortColumn, SortDirection } from '../interfaces/department-sort.type';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-departments',
  imports: [
    DepartmentTable,
    DepartmentForm,
    DepartmentModal,
    ConfirmationDialog,
    EmptyState,
    MatIconModule,
  ],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
  protected readonly isDepartmentFormOpen = signal(false);
  private readonly departmentsService = inject(DepartmentsService);
  protected readonly departments = signal<Department[]>([]);
  private readonly toastr = inject(ToastrService);
  protected readonly selectedDepartment = signal<Department | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly isConfirmationDialogOpen = signal(false);
  protected readonly sortColumn = signal<DepartmentSortColumn | null>(null);
  protected readonly sortDirection = signal<SortDirection | null>(null);
  protected readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value);
      });
  }

  ngOnInit(): void {
    this.loadDepartments();
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

  private loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  private departmentCodeExists(code: string, ignoreDepartmentId?: number): boolean {
    return this.departments().some((department) => {
      const isSameCode = department.code.trim().toLowerCase() === code.trim().toLowerCase();

      const isDifferentDepartment = department.id !== ignoreDepartmentId;

      return isSameCode && isDifferentDepartment;
    });
  }

  save(request: CreateDepartmentRequest): void {
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

    this.departmentsService
      .createDepartment(request)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
        }),
      )
      .subscribe({
        next: (createdDepartment: Department) => {
          this.toastr.success('Department created successfully');
          this.closeDepartmentForm();
          this.loadDepartments();
        },
        error: (error) => {
          this.toastr.error(error.message);
        },
      });
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
    this.departmentsService
      .updateDepartment(selectedDepartment.id, request)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toastr.success('Department updated successfully');
          this.closeDepartmentForm();
          this.loadDepartments();
        },
        error: (error) => {
          this.toastr.error(error.message);
        },
      });
  }

  protected confirmDeleteDepartment(): void {
    const department = this.selectedDepartment();
    if (!department) {
      return;
    }
    this.departmentsService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.toastr.success('Department deleted successfully');
        this.closeDeleteConfirmationDialog();
        this.loadDepartments();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
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
}
