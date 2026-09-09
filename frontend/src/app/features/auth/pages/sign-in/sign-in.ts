import { afterNextRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForgotPassword } from '../../components/forgot-password/forgot-password';
import { ResetPassword } from '../../components/reset-password/reset-password';
import { ToastrService } from 'ngx-toastr';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
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

    checkbox: new FormControl(false, { nonNullable: true }),
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
      next: (data) => {
        if (data.employee.theme) {
          this.themeService.setTheme(data.employee.theme);
        }
        this.toastr.success('Login Success', 'Success');
        this.loginForm.reset();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        const message = error.error?.message || error.message || 'Login Failed';
        this.toastr.error(message, 'Login Failed');
      },
    });
  }

  showPassword = signal(false);
  private readonly forgotPasswordButton =
    viewChild<ElementRef<HTMLButtonElement>>('forgotPasswordButton');

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

    this.forgotPasswordButton()?.nativeElement.focus();
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
    this.selectedEmployee.set(null);
    this.forgotPasswordButton()?.nativeElement.focus();
  }

  onResetPasswordCompleted(): void {
    this.closeResetPassword();
    this.selectedEmployee.set(null);
  }

  getEmployeeIdError(): string {
    if (!this.employeeId?.touched) {
      return '';
    }

    if (this.employeeId?.hasError('maxlength')) {
      return 'employeeId-maxlength-error';
    }

    if (this.employeeId?.hasError('invalidEmployeeId')) {
      return 'employeeId-invalid-error';
    }

    if (this.employeeId?.hasError('required')) {
      return 'employeeId-required-error';
    }
    return '';
  }

  getPasswordError(): string {
    if (!this.password?.touched) {
      return '';
    }

    if (this.password?.hasError('maxlength')) {
      return 'password-maxlength-error';
    }

    if (this.password?.hasError('required')) {
      return 'password-required-error';
    }

    if (this.password?.hasError('invalidPassword')) {
      return 'password-invalid-error';
    }
    return '';
  }
}
