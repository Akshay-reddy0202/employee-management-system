import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Department } from '../../interfaces/department.interface';
import { CreateDepartmentRequest } from '../../interfaces/create-department-request.interface';
import { DepartmentStatus } from '../../interfaces/department-status.type';

@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule, MatSelectModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
})
export class DepartmentForm {
  departmentForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    code: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(10)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    status: new FormControl<DepartmentStatus | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.departmentForm.get('name');
  }
  get code() {
    return this.departmentForm.get('code');
  }
  get description() {
    return this.departmentForm.get('description');
  }
  get status() {
    return this.departmentForm.get('status');
  }

  onSubmit() {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.departmentForm.getRawValue();

    if (formValue.status === null) {
      return;
    }

    const request: CreateDepartmentRequest = formValue;
    this.save.emit(request);
    this.cancel.emit();
  }

  protected readonly cancel = output<void>();
  protected readonly save = output<CreateDepartmentRequest>();
  public readonly department = input<Department | null>(null);

  onCancel(): void {
    this.cancel.emit();
  }
}
