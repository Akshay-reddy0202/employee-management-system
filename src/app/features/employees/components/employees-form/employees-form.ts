import {
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { EmployeeInterface } from '../../interfaces/employee.model';
import { EmployeeFormMode } from '../../interfaces/employees-form-mode.type';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateEmployeeRequest } from '../../interfaces/update-employee-request.model';
import { Department } from '../../../departments/interfaces/department.interface';
import { DesignationInterface } from '../../../designations/interfaces/designation.model';
import { ClickOutside } from '../../../../shared/directives/click-outside';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule, ClickOutside],
  templateUrl: './employees-form.html',
  styleUrl: './employees-form.css',
})
export class EmployeesForm {
  protected readonly employee = input.required<EmployeeInterface>();
  protected readonly mode = input.required<EmployeeFormMode>();

  protected readonly cancel = output<void>();
  protected readonly save = output<UpdateEmployeeRequest>();
  protected readonly unSavedChanges = output<void>();

  protected readonly departments = input.required<Department[]>();
  protected readonly designations = input.required<DesignationInterface[]>();

  protected readonly designationSearchTerm = signal('');
  protected readonly isDesignationDropdownOpen = signal(false);

  protected readonly departmentSearchTerm = signal('');
  protected readonly isDepartmentDropdownOpen = signal(false);

  protected readonly employeeForm = new FormGroup({
    employeeId: new FormControl('', {
      nonNullable: true,
    }),

    role: new FormControl('', {
      nonNullable: true,
    }),

    fullName: new FormControl('', {
      nonNullable: true,
    }),

    dateOfBirth: new FormControl('', {
      nonNullable: true,
    }),

    emailID: new FormControl('', {
      nonNullable: true,
    }),

    departmentId: new FormControl<string | null>(null),

    designationId: new FormControl<string | null>(null),

    managerId: new FormControl<string | null>(null),

    status: new FormControl<string | null>(null),

    joiningDate: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      const employee = this.employee();

      const designation = this.designations().find(
        (designation) => designation.id === employee.designationId,
      );

      const department = this.departments().find(
        (department) => department.id === employee.departmentId,
      );

      this.employeeForm.patchValue({
        employeeId: employee.employeeId,
        role: employee.role,
        fullName: employee.fullName,
        dateOfBirth: employee.dateOfBirth,
        emailID: employee.emailID,
        departmentId: employee.departmentId,
        designationId: employee.designationId,
        managerId: employee.managerId,
        status: employee.status,
        joiningDate: employee.joiningDate,
      });

      this.departmentSearchTerm.set(department?.name ?? '');
      this.designationSearchTerm.set(designation?.name ?? '');
    });
  }

  protected onDepartmentSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.departmentSearchTerm.set(input.value);
  }

  protected readonly filteredDepartments = computed(() => {
    const searchTerm = this.departmentSearchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.departments();
    }

    return this.departments().filter((department) =>
      department.name.toLowerCase().includes(searchTerm),
    );
  });

  protected selectDepartment(department: Department): void {
    this.employeeForm.controls.departmentId.setValue(department.id);
    this.departmentSearchTerm.set(department.name);
    this.isDepartmentDropdownOpen.set(false);
  }

  protected openDepartmentDropdown() {
    if (this.mode() === 'view') {
      return;
    }
    this.isDepartmentDropdownOpen.set(true);
  }

  protected closeDepartmentDropdown(): void {
    this.isDepartmentDropdownOpen.set(false);
  }

  protected onDesignationSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.designationSearchTerm.set(input.value);
  }

  protected readonly filteredDesignations = computed(() => {
    const searchTerm = this.designationSearchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.designations();
    }

    return this.designations().filter((designation) =>
      designation.name.toLowerCase().includes(searchTerm),
    );
  });

  protected selectDesignation(designation: DesignationInterface): void {
    this.employeeForm.controls.designationId.setValue(designation.id);
    this.designationSearchTerm.set(designation.name);

    this.isDesignationDropdownOpen.set(false);
  }

  protected openDesignationDropdown() {
    if (this.mode() === 'view') {
      return;
    }
    this.isDesignationDropdownOpen.set(true);
  }

  protected closeDesignationDropdown(): void {
    this.isDesignationDropdownOpen.set(false);
  }

  protected onCancel(): void {
    if (this.employeeForm.dirty) {
      this.unSavedChanges.emit();
      return;
    }
    this.cancel.emit();
  }

  protected onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const formValue = this.employeeForm.getRawValue();

    const request: UpdateEmployeeRequest = {
      departmentId: formValue.departmentId,
      designationId: formValue.designationId,
      managerId: formValue.managerId,
      status: formValue.status,
      joiningDate: formValue.joiningDate,
    };
    this.save.emit(request);
  }
}
