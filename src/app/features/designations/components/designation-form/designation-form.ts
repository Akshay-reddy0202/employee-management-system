import { Component, effect, input, output } from '@angular/core';
import { DesignationInterface } from '../../interfaces/designation.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateDesignationRequest } from '../../interfaces/create-designation-request.model';

@Component({
  selector: 'app-designation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './designation-form.html',
  styleUrl: './designation-form.css',
})
export class DesignationForm {
  public readonly designation = input<DesignationInterface | null>(null);
  protected readonly cancel = output<void>();
  protected readonly save = output<CreateDesignationRequest>();
  protected readonly unSavedChanges = output<void>();

  protected readonly designationForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),

    status: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.designationForm.get('name');
  }

  get status() {
    return this.designationForm.get('status');
  }

  constructor() {
    effect(() => {
      const designation = this.designation();
      if (designation) {
        this.designationForm.patchValue({
          name: designation.name,
          status: designation.status,
        });
      }
    });
  }

  protected onCancel(): void {
    if (this.designationForm.dirty) {
      this.unSavedChanges.emit();
      return;
    } else {
      this.cancel.emit();
    }
  }

  protected onSubmit(): void {
    if (this.designationForm.invalid) {
      this.designationForm.markAllAsTouched();
      return;
    }

    const formValue = this.designationForm.getRawValue();
    const request: CreateDesignationRequest = {
      name: formValue.name,
      status: formValue.status,
    };
    this.save.emit(request);
  }
}
