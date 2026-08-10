import { Component, effect, input, output } from '@angular/core';
import { EmployeeInterface } from '../../interfaces/employee.model';
import { EmployeeFormMode } from '../../interfaces/employees-form-mode.type';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateEmployeeRequest } from '../../interfaces/update-employee-request.model';

@Component({
  selector: 'app-employees-form',
  imports: [ReactiveFormsModule],
  templateUrl: './employees-form.html',
  styleUrl: './employees-form.css',
})
export class EmployeesForm {
  readonly employee = input.required<EmployeeInterface>();
  readonly mode = input.required<EmployeeFormMode>();

  protected readonly cancel = output<void>();
  protected readonly save = output<UpdateEmployeeRequest>();

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

    departmentId: new FormControl<number | null>(null),

    designationId: new FormControl<number | null>(null),

    managerId: new FormControl<number | null>(null),

    status: new FormControl<string | null>(null),

    joiningDate: new FormControl<string | null>(null),
  });

  constructor() {
    effect(() => {
      const employee = this.employee();

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
    });
  }

  protected onCancel(): void {
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
