import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForgotPassword } from '../forgot-password/forgot-password';
import { ResetPassword } from '../reset-password/reset-password';
import { Toast, ToastrService } from 'ngx-toastr';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { EmployeeInterface } from '../../../employees/models/employee.model';
import { EmployeeIdDirective } from '../../../../shared/directives/employee-id.directive';
import { employeeIdValidator } from '../../../../shared/validators/employee-id.validator';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, EmployeeIdDirective, ForgotPassword, ResetPassword],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  loginForm = new FormGroup({
    employeeId: new FormControl('E', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(5), employeeIdValidator()],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordValidator, Validators.maxLength(15)],
    }),

    checkbox: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  get employeeId() {
    return this.loginForm.get('employeeId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get checkbox() {
    return this.loginForm.get('checkbox');
  }

  private readonly authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const formValue = this.loginForm.getRawValue();
    this.authService.login(formValue).subscribe({
      next: (employee) => {
        this.authService.saveCurrentUser(employee);
        this.themeService.setTheme(employee.theme);
        this.toastr.success('Login Success', 'Success');
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toastr.error(error.message, 'Login Failed');
      },
    });
  }

  showPassword = signal(false);

  togglePassword() {
    this.showPassword.update((value) => !value);
  }

  showForgotPassword = signal(false);

  onForgotPasswordClick(event: MouseEvent): void {
    event?.preventDefault();
    this.openForgotPassword();
  }

  openForgotPassword(): void {
    this.showForgotPassword.set(true);
  }

  closeForgotPassword(): void {
    this.showForgotPassword.set(false);
  }

  showResetPassword = signal(false);

  selectedEmployee = signal<EmployeeInterface | null>(null);
  openResetPassword(employee: EmployeeInterface) {
    this.selectedEmployee.set(employee);
    this.showForgotPassword.set(false);
    this.showResetPassword.set(true);
  }

  closeResetPassword(): void {
    this.showResetPassword.set(false);
  }
  onResetPasswordCompleted(): void {
    this.closeResetPassword();
    this.selectedEmployee.set(null);
  }
}
