import { Component, computed, effect, input, output, signal } from '@angular/core';
import { EmployeeInterface } from '../../interfaces/employee.model';
import { EmployeeFormMode } from '../../interfaces/employees-form-mode.type';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  protected readonly managerSearchTerm = signal('');
  protected readonly isManagerDropdownOpen = signal(false);

  protected readonly employees = input.required<EmployeeInterface[]>();

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

    salary: new FormControl<number | null>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),

    departmentId: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    designationId: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    managerId: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    status: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),

    joiningDate: new FormControl<string | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected get fullName() {
    return this.employeeForm.get('fullName');
  }

  protected get emailID() {
    return this.employeeForm.get('emailID');
  }

  protected get salary() {
    return this.employeeForm.get('salary');
  }

  protected get departmentId() {
    return this.employeeForm.get('departmentId');
  }

  protected get designationId() {
    return this.employeeForm.get('designationId');
  }

  protected get managerId() {
    return this.employeeForm.get('managerId');
  }

  protected get status() {
    return this.employeeForm.get('status');
  }

  protected get joiningDate() {
    return this.employeeForm.get('joiningDate');
  }

  constructor() {
    effect(() => {
      const employee = this.employee();

      const designation = this.designations().find(
        (designation) => designation.id === employee.designationId,
      );

      const department = this.departments().find(
        (department) => department.id === employee.departmentId,
      );

      const manager = employee.managerId
        ? this.employees().find((manager) => manager.id === employee.managerId)
        : null;

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
        salary: employee.salary,
      });

      this.departmentSearchTerm.set(department?.name ?? '');
      this.designationSearchTerm.set(designation?.name ?? '');
      this.managerSearchTerm.set(manager?.fullName ?? '');

      if (this.mode() === 'view') {
        this.employeeForm.controls.status.disable();
      } else {
        this.employeeForm.controls.status.enable();
      }
    });
  }

  protected onDepartmentSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.departmentSearchTerm.set(input.value);
    this.employeeForm.controls.departmentId.setValue(null);
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
    this.employeeForm.controls.designationId.setValue(null);
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

  protected onManagerSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.managerSearchTerm.set(input.value);
    this.employeeForm.controls.managerId.setValue(null);
  }

  protected readonly filteredManagers = computed(() => {
    const searchTerm = this.managerSearchTerm().trim().toLowerCase();

    if (!searchTerm) {
      return this.employees();
    }
    return this.employees().filter((employee) => {
      const matchesName = employee.fullName.toLowerCase().includes(searchTerm);
      const matchesEmployeeId = employee.employeeId.toLowerCase().includes(searchTerm);
      const matchesDesignation = this.getDesignationName(employee.designationId)
        .toLowerCase()
        .includes(searchTerm);
      return matchesName || matchesEmployeeId || matchesDesignation;
    });
  });

  protected selectManager(employee: EmployeeInterface): void {
    this.employeeForm.controls.managerId.setValue(employee.id ?? null);
    this.managerSearchTerm.set(employee.fullName);
    this.isManagerDropdownOpen.set(false);
  }

  protected openManagerDropdown() {
    if (this.mode() === 'view') {
      return;
    }
    this.isManagerDropdownOpen.set(true);
  }

  protected closeManagerDropdown(): void {
    this.isManagerDropdownOpen.set(false);
  }

  protected getManagerName(managerId: string | null | undefined): string {
    const manager = this.employees().find((employee) => employee.id === managerId);
    return manager?.fullName ?? '-';
  }

  protected getDesignationName(designationId: string | null | undefined): string {
    const designation = this.designations().find((designation) => designation.id === designationId);
    return designation?.name ?? '-';
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
      salary: formValue.salary,
      departmentId: formValue.departmentId,
      designationId: formValue.designationId,
      managerId: formValue.managerId,
      status: formValue.status,
      joiningDate: formValue.joiningDate,
    };
    this.save.emit(request);
  }
}
