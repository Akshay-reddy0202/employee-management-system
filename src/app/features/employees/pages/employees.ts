import { Component, computed, inject, signal } from '@angular/core';
import { EmployeesTable } from '../components/employees-table/employees-table';
import { EmployeeService } from '../services/employee.service';
import { EmployeeInterface } from '../interfaces/employee.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormMode } from '../interfaces/employees-form-mode.type';
import { EmployeesForm } from '../components/employees-form/employees-form';
import { Modal } from '../../../shared/components/modal/modal';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';
import { DesignationsService } from '../../designations/services/designations.service';
import { DesignationInterface } from '../../designations/interfaces/designation.model';
import { DepartmentsService } from '../../departments/services/departments.service';
import { Department } from '../../departments/interfaces/department.interface';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-employees',
  imports: [EmployeesTable, EmployeesForm, Modal, ConfirmationDialog],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  private readonly employeesService = inject(EmployeeService);
  private readonly toastr = inject(ToastrService);
  protected readonly employees = signal<EmployeeInterface[]>([]);
  protected readonly selectedEmployee = signal<EmployeeInterface | null>(null);
  protected readonly isEmployeeFormOpen = signal(false);
  protected readonly employeeFormMode = signal<EmployeeFormMode | null>(null);
  private readonly designationsService = inject(DesignationsService);
  protected readonly designations = signal<DesignationInterface[]>([]);
  private readonly departmentsService = inject(DepartmentsService);
  protected readonly departments = signal<Department[]>([]);
  protected readonly selectedDepartmentId = signal('');
  protected readonly selectedDesignationId = signal('');
  protected readonly searchTerm = signal('');
  protected readonly isUnsavedChangesDialogOpen = signal(false);

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDesignations();
    this.loadDepartments();
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
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

    this.employeesService.updateEmployee(employee.id, request).subscribe({
      next: () => {
        this.toastr.success('Employee Updated Successfully');
        this.closeEmployeeForm();
        this.loadEmployees();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  private loadDesignations(): void {
    this.designationsService.getDesignations().subscribe({
      next: (designations) => {
        this.designations.set(designations);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
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

      const manager = this.employees().find((manager) => manager.id === employee.managerId);
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
