import { Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateProfileRequest } from '../../interfaces/update-profile-request.interface';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {
  readonly save = output<UpdateProfileRequest>();
  readonly cancel = output<void>();
  readonly unSavedChanges = output<void>();

  protected readonly profileForm = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateOfBirth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  get fullName() {
    return this.profileForm.get('fullName');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }
  get dateOfBirth() {
    return this.profileForm.get('dateOfBirth');
  }
  get address() {
    return this.profileForm.get('address');
  }

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const formValue = this.profileForm.getRawValue();
    const request: UpdateProfileRequest = {
      fullName: formValue.fullName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      address: formValue.address,
    };

    this.save.emit(request);
  }

  protected onCancel(): void {
    if (this.profileForm.dirty) {
      this.unSavedChanges.emit();
      return;
    }
    this.cancel.emit();
  }
}
