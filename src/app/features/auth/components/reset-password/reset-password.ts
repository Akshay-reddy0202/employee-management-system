import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
import { AuthService } from '../../../../core/services/auth.service';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';
import { passwordValidator } from '../../../../shared/validators/password.validator';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  resetPasswordForm = new FormGroup(
    {
      createPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(15), passwordValidator],
      }),
      confirmPassword: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    },
    {
      validators: confirmPasswordValidator,
    },
  );

  get createPassword() {
    return this.resetPasswordForm.get('createPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  employee = input.required<EmployeeInterface>();
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const employee = this.employee();
    const newPassword = this.resetPasswordForm.getRawValue().createPassword;

    this.authService.resetPassword(employee.employeeId, newPassword).subscribe({
      next: () => {
        this.onCompleted();
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        this.toastr.error(error.message, 'password update failed');
      },
    });
  }

  showCreatePassword = signal(false);
  showConfirmPassword = signal(false);

  toggleCreatePassword() {
    this.showCreatePassword.update((value) => !value);
  }

  toggleConfirmPassword() {
    this.showConfirmPassword.update((value) => !value);
  }

  cancel = output<void>();
  completed = output<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onCompleted(): void {
    this.toastr.success('Password reset successfully', 'Success');
    this.completed.emit();
  }
}
