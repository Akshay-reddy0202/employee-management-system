import { Component, effect, input, output } from '@angular/core';
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
  }

  protected readonly cancel = output<void>();
  protected readonly save = output<CreateDepartmentRequest>();
  public readonly department = input<Department | null>(null);
  readonly isSubmitting = input(false);
  protected readonly unSavedChanges = output<void>();

  protected onCancel(): void {
    if (this.departmentForm.dirty) {
      this.unSavedChanges.emit();
    } else {
      this.cancel.emit();
    }
  }

  constructor() {
    effect(() => {
      const department = this.department();

      if (department) {
        this.departmentForm.patchValue({
          name: department.name,
          code: department.code,
          description: department.description,
          status: department.status,
        });
      } else {
        this.departmentForm.reset();
      }
    });
  }
}
