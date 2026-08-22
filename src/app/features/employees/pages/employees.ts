import { Component, computed, effect, inject, signal } from '@angular/core';
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
    this.employeeStore.loadAllEmployees();
    this.designationStore.loadDesignations();
    this.departmentsStore.loadAllDepartments();
  }

  protected refreshEmployees(): void {
    this.employeeStore.refresh();
  }

  protected onPageChange(page: number): void {
    this.employeeStore.setCurrentPage(page);
    this.employeeStore.loadEmployees();
  }

  protected onEditEmployee(employee: EmployeeInterface): void {
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

  protected readonly filteredEmployees = computed(() => {
    const departmentId = this.selectedDepartmentId();
    const designationId = this.selectedDesignationId();

    return this.employees().filter((employee) => {
      const matchesDepartment = !departmentId || employee.departmentId === departmentId;
      const matchesDesignation = !designationId || employee.designationId === designationId;

      return matchesDepartment && matchesDesignation;
    });
  });

  protected onDepartmentFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDepartmentId.set(select.value);
  }

  protected onDesignationFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedDesignationId.set(select.value);
  }

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected readonly filteredTable = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    if (!search) {
      return this.employees();
    }

    return this.employees().filter((employee) => {
      const department = this.departments().find(
        (department) => department.id === employee.departmentId,
      );
      const designation = this.designations().find(
        (designation) => designation.id === employee.designationId,
      );

      const manager = this.allEmployees().find((manager) => manager.id === employee.managerId);
      const matchesEmployeeId = employee.employeeId.toLowerCase().includes(search);
      const matchesName = employee.fullName.toLowerCase().includes(search);
      const matchesDepartment = department?.name.toLowerCase().includes(search);
      const matchesDesignation = designation?.name.toLowerCase().includes(search);
      const matchesManager = manager?.fullName.toLowerCase().includes(search);

      return (
        matchesEmployeeId ||
        matchesName ||
        matchesDepartment ||
        matchesDesignation ||
        matchesManager
      );
    });
  });

  protected readonly displayedEmployees = computed(() => {
    const filteredEmployees = this.filteredEmployees();
    const filteredTable = this.filteredTable();

    return filteredEmployees.filter((employee) => filteredTable.includes(employee));
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
