import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { EmployeesTable } from '../components/employees-table/employees-table';
import { EmployeeInterface } from '../interfaces/employee.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormMode } from '../interfaces/employees-form-mode.type';
import { EmployeesForm } from '../components/employees-form/employees-form';
import { Modal } from '../../../shared/components/modal/modal';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeStore } from '../state/employee.store';
import { DesignationStore } from '../../designations/state/designation.store';
import { DepartmentsStore } from '../../departments/state/department.store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-employees',
  imports: [EmployeesTable, EmployeesForm, Modal, ConfirmationDialog, Pagination, MatIconModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  private readonly toastr = inject(ToastrService);
  protected readonly employeeStore = inject(EmployeeStore);
  private readonly designationStore = inject(DesignationStore);
  private readonly departmentsStore = inject(DepartmentsStore);

  protected readonly selectedEmployee = signal<EmployeeInterface | null>(null);
  protected readonly isEmployeeFormOpen = signal(false);
  protected readonly employeeFormMode = signal<EmployeeFormMode | null>(null);

  protected readonly designations = this.designationStore.designations;
  protected readonly departments = this.departmentsStore.allDepartments;

  protected readonly selectedDepartmentId = signal('');
  protected readonly selectedDesignationId = signal('');
  protected readonly searchTerm = signal('');
  private readonly searchSubject = new Subject<string>();
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isUnsavedChangesDialogOpen = signal(false);

  protected readonly updateSuccess = this.employeeStore.updateSuccess;
  protected readonly error = this.employeeStore.error;
  protected readonly totalEmployees = this.employeeStore.totalEmployees;
  protected readonly allEmployees = this.employeeStore.allEmployees;
  protected readonly employees = this.employeeStore.employees;
  protected readonly currentPage = this.employeeStore.currentPage;
  protected readonly pageSize = this.employeeStore.pageSize;
  protected readonly totalPages = this.employeeStore.totalPages;

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.employeeStore.setSearchTerm(value);
      });

    effect(() => {
      const error = this.error();

      if (error) {
        this.toastr.error(error);
      }

      if (this.updateSuccess()) {
        this.toastr.success('Employee updated successfully');
        this.closeEmployeeForm();
        this.employeeStore.clearUpdateSuccess();
      }
    });
  }

  ngOnInit(): void {
    this.employeeStore.loadEmployees();
    this.designationStore.loadDesignations();
    this.departmentsStore.loadAllDepartments();
  }

  protected refreshEmployees(): void {
    this.employeeStore.refresh();
  }

  protected onPageChange(page: number): void {
    this.employeeStore.setCurrentPage(page);
  }

  protected onEditEmployee(employee: EmployeeInterface): void {
    this.employeeStore.loadAllEmployees();
    this.selectedEmployee.set(employee);
    this.isEmployeeFormOpen.set(true);
    this.employeeFormMode.set('edit');
  }

  protected onViewEmployee(employee: EmployeeInterface): void {
    this.selectedEmployee.set(employee);
    this.isEmployeeFormOpen.set(true);
    this.employeeFormMode.set('view');
  }

  protected closeEmployeeForm(): void {
    this.selectedEmployee.set(null);
    this.isEmployeeFormOpen.set(false);
    this.employeeFormMode.set(null);
  }

  protected onSaveEmployee(request: UpdateEmployeeRequest): void {
    const employee = this.selectedEmployee();
    if (!employee?.id) {
      return;
    }
    this.employeeStore.updateEmployee(employee.id, request);
  }

  protected onDepartmentFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDepartmentId.set(select.value);
    this.employeeStore.setDepartmentFilter(select.value);
  }

  protected onDesignationFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDesignationId.set(select.value);
    this.employeeStore.setDesignationFilter(select.value);
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
    this.searchSubject.next(input.value);
  }

  protected readonly displayedEmployees = computed(() => {
    return this.employees();
  });

  protected onUnSavedChangesDialog(): void {
    this.isUnsavedChangesDialogOpen.set(true);
  }

  protected continueEditing(): void {
    this.isUnsavedChangesDialogOpen.set(false);
  }

  protected discardChanges(): void {
    this.isUnsavedChangesDialogOpen.set(false);
    this.closeEmployeeForm();
  }
}
