import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { RouterLink } from '@angular/router';
import { EmployeeIdDirective } from '../../shared/directives/employee-id-directive';
import { employeeIdValidator } from '../../shared/validators/employee-id-validator';
import { ForgotPassword } from '../forgot-password/forgot-password';
import { ResetPassword } from '../reset-password/reset-password';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink, EmployeeIdDirective, ForgotPassword,ResetPassword],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  loginForm = new FormGroup({
    employeeId: new FormControl('E', [
      Validators.required,
      Validators.maxLength(5),
      employeeIdValidator(),
    ]),
    password: new FormControl('', [
      Validators.required,
      passwordValidator,
      Validators.maxLength(15),
    ]),
    role: new FormControl('', [Validators.required]),
    checkbox: new FormControl(false, [Validators.requiredTrue]),
  });

  get employeeId() {
    return this.loginForm.get('employeeId');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get role() {
    return this.loginForm.get('role');
  }
  get checkbox() {
    return this.loginForm.get('checkbox');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);
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

  openResetPassword():void {
    this.showForgotPassword.set(false);
    this.showResetPassword.set(true);
  }

  closeResetPassword():void {
    this.showResetPassword.set(false);
  }
}
