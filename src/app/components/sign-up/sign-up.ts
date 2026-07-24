import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../shared/validators/password-validator';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator';
import { RouterLink } from '@angular/router';
import { FullNameDirective } from '../../shared/directives/full-name-directive';
import { fullNameValidator } from '../../shared/validators/full-name-validator';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink, FullNameDirective, TermsAndConditions],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  signUpForm = new FormGroup(
    {
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), fullNameValidator],
      }),
      emailID: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      createPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, passwordValidator, Validators.maxLength(15)],
      }),
      confirmPassword: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(15)],
      }),
      role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      checkbox: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    {
      validators: confirmPasswordValidator,
    },
  );

  get fullName() {
    return this.signUpForm.get('fullName');
  }

  get emailID() {
    return this.signUpForm.get('emailID');
  }

  get createPassword() {
    return this.signUpForm.get('createPassword');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get role() {
    return this.signUpForm.get('role');
  }

  get checkbox() {
    return this.signUpForm.get('checkbox');
  }

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }
    const formValue = this.signUpForm.getRawValue();
    this.authService.register(formValue).subscribe({
      next: (employee) => {
        console.log('Employee registered successfully', employee);
        this.signUpForm.reset();
      },
      error: (error) => {
        console.error('registration failed!', error);
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

  isTermsModalOpen = signal(false);

  onCheckboxClick(event: MouseEvent): void {
    event.preventDefault();
    this.openTermsModal();
  }

  openTermsModal(): void {
    this.isTermsModalOpen.set(true);
  }

  closeTermsModal(): void {
    this.isTermsModalOpen.set(false);
  }

  acceptTerms(): void {
    this.signUpForm.get('checkbox')?.setValue(true);
    this.closeTermsModal();
  }

  cancelTerms(): void {
    this.signUpForm.get('checkbox')?.setValue(false);
    this.closeTermsModal();
  }

  private readonly authService = inject(AuthService);
}
