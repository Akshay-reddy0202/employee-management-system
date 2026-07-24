import { Component, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator';
import { passwordValidator } from '../../shared/validators/password-validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
        passwordValidator,
      ]),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    },
    {
      validators: confirmPasswordValidator,
    },
  );

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    console.log(this.resetPasswordForm.value);
  }

  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleNewPassword() {
    this.showNewPassword.update((value) => !value);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((value) => !value);
  }

  cancel = output<void>();

  onCancel():void {
    this.cancel.emit();
  }
}
