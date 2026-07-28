import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator';
import { passwordValidator } from '../../shared/validators/password-validator';
import { EmployeeInterface } from '../../models/employee-interface';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(15), passwordValidator],
      }),
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

  employee = input.required<EmployeeInterface>();
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);


  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const employee = this.employee();
    const newPassword = this.resetPasswordForm.getRawValue().newPassword;

    this.authService.resetPassword(employee.employeeId, newPassword).subscribe({
      next: () => {
        this.toastr.success('Password Updated', 'success');
        this.onCompleted();
        this.router.navigate(['/sign-in']);
      },
      error:(error)=>{
        this.toastr.error(error.message,'password update failed');
      }
    });
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
  completed = output<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  onCompleted():void{
    this.toastr.success('Password reset successfully','Success');
    this.completed.emit();
  }
}
