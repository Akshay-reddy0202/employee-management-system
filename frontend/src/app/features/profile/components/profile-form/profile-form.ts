import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateProfileRequest } from '../../interfaces/update-profile-request.interface';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css',
})
export class ProfileForm {
  readonly save = output<UpdateProfileRequest>();
  readonly cancel = output<void>();
  readonly unSavedChanges = output<void>();
  protected skills: string[] = [];
  protected profileDetails = input.required<EmployeeInterface>();

  protected readonly profileForm = new FormGroup({
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dateOfBirth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly skillInput = new FormControl('', { nonNullable: true });
  get phoneNumber() {
    return this.profileForm.get('phoneNumber');
  }
  get dateOfBirth() {
    return this.profileForm.get('dateOfBirth');
  }
  get address() {
    return this.profileForm.get('address');
  }

  constructor() {
    effect(() => {
      const profileDetails = this.profileDetails();
      this.profileForm.patchValue({
        phoneNumber: profileDetails.phoneNumber ?? '',
        dateOfBirth: profileDetails.dateOfBirth ? profileDetails.dateOfBirth.split('T')[0] : '',
        address: profileDetails.address ?? '',
      });
      this.skills = [...(profileDetails.skills ?? [])];
    });
  }

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const formValue = this.profileForm.getRawValue();
    const request: UpdateProfileRequest = {
      phoneNumber: formValue.phoneNumber,
      dateOfBirth: formValue.dateOfBirth,
      address: formValue.address,
      skills: this.skills,
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

  protected addSkill(): void {
    const skill = this.skillInput.value.trim();

    if (!skill) {
      return;
    }

    if (this.skills.includes(skill)) {
      return;
    }

    this.skills.push(skill);
    this.skillInput.setValue('');
  }

  protected removeSkill(skill: string): void {
    this.skills = this.skills.filter((currentSkill) => currentSkill !== skill);
  }
}
