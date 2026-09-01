import { Component, inject, signal, ElementRef, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TermsAndConditions } from '../../components/terms-and-conditions/terms-and-conditions';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';
import { FullNameDirective } from '../../../../shared/directives/full-name-directive';
import { fullNameValidator } from '../../../../shared/validators/full-name.validator';
import { ageValidator } from '../../../../shared/validators/age.validator';
import { AuthService } from '../../../../core/services/auth.service';
import { EmployeeIdDialog } from '../../../../shared/components/employee-id-dialog/employee-id-dialog';

@Component({
  selector: 'app-sign-up',
  imports: [
    ReactiveFormsModule,
    EmployeeIdDialog,
    RouterLink,
    FullNameDirective,
    TermsAndConditions,
  ],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  signUpForm = new FormGroup(
    {
      role: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3), fullNameValidator()],
      }),
      dateOfBirth: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, ageValidator(18)],
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

  get dateOfBirth() {
    return this.signUpForm.get('dateOfBirth');
  }

  protected readonly maxDate = new Date().toISOString().split('T')[0];

  private readonly authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');
  private router = inject(Router);

  protected readonly isEmployeeIdDialogOpen = signal(false);
  protected readonly generatedEmployeeId = signal('');
  protected readonly isAcknowledged = signal(false);

  private readonly termsCheckbox = viewChild<ElementRef<HTMLInputElement>>('termsCheckbox');

  onSubmit() {
    if (this.signUpForm.invalid) {
      return;
    }
    const formValue = this.signUpForm.getRawValue();
    this.authService.register(formValue).subscribe({
      next: (employee) => {
        this.generatedEmployeeId.set(employee.employeeId);
        this.isEmployeeIdDialogOpen.set(true);
        this.signUpForm.reset();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Registration Failed');
        this.emailID?.reset();
        setTimeout(() => {
          this.emailInput()?.nativeElement.focus();
        });
      },
    });
  }

  closeEmployeeIdDialog(): void {
    this.isEmployeeIdDialogOpen.set(false);
    this.router.navigate(['/sign-in']);
  }

  ngOnInit(): void {
    this.initializeEmailIDListener();
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

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      event.preventDefault();

      // Keep checkbox unchecked for now
      this.signUpForm.get('checkbox')?.setValue(false);

      this.openTermsModal();
    } else {
      // User is unchecking
      this.signUpForm.get('checkbox')?.setValue(false);
    }
  }

  openTermsModal(): void {
    this.isTermsModalOpen.set(true);
  }

  closeTermsModal(): void {
    this.isTermsModalOpen.set(false);
    this.termsCheckbox()?.nativeElement.focus();
  }

  // acceptTerms(): void {
  //   this.signUpForm.get('checkbox')?.setValue(true);
  //   this.closeTermsModal();
  // }

  cancelTerms(): void {
    this.signUpForm.get('checkbox')?.setValue(true);
    this.closeTermsModal();
  }

  private initializeEmailIDListener(): void {
    const emailControl = this.emailID;

    if (!emailControl) {
      return;
    }

    emailControl?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(() => emailControl.valid),
        switchMap((email: string) => this.authService.checkEmailExists(email)),
      )
      .subscribe((emailExists) => {
        this.handleEmailExists(emailExists);
      });
  }

  private handleEmailExists(emailExists: boolean): void {
    if (emailExists) {
      this.toastr.error('Email already exists');

      this.emailID?.setErrors({
        emailExists: true,
      });

      setTimeout(() => {
        this.emailInput()?.nativeElement.focus();
      });
    }
  }

  getFullNameError(): string {
    if (!this.fullName?.touched) {
      return '';
    }

    if (this.fullName?.hasError('required')) {
      return 'fullName-required-error';
    }

    if (this.fullName?.hasError('invalidFullName')) {
      return 'fullName-invalid-error';
    }

    return '';
  }

  getEmailIdError(): string {
    if (!this.emailID?.touched) {
      return '';
    }

    if (this.emailID?.hasError('required')) {
      return 'emailID-required-error';
    }

    if (this.emailID?.hasError('email')) {
      return 'emailID-email-error';
    }

    if (this.emailID?.hasError('emailExists')) {
      return 'emailID-emailExists-error';
    }

    return '';
  }

  getDateOfBirthError(): string {
    if (!this.dateOfBirth?.touched) {
      return '';
    }

    if (this.dateOfBirth?.hasError('required')) {
      return 'dateOfBirth-required-error';
    }

    if (this.dateOfBirth?.hasError('minimumAge')) {
      return 'dateOfBirth-minimumAge-error';
    }

    return '';
  }

  getCreatePasswordError(): string {
    if (!this.createPassword?.touched) {
      return '';
    }

    if (this.createPassword?.hasError('required')) {
      return 'createPassword-required-error';
    }

    if (this.createPassword?.hasError('invalidPassword')) {
      return 'createPassword-invalidPassword-error';
    }

    if (this.createPassword?.hasError('maxlength')) {
      return 'createPassword-maxlength-error';
    }

    return '';
  }

  getConfirmPasswordError(): string {
    if (!this.confirmPassword?.touched) {
      return '';
    }

    if (this.confirmPassword?.hasError('required')) {
      return 'confirmPassword-required-error';
    }

    if (this.confirmPassword?.hasError('maxlength')) {
      return 'confirmPassword-maxlength-error';
    }

    if (this.confirmPassword?.hasError('passwordMismatch')) {
      return 'confirmPassword-passwordMismatch-error';
    }
    return '';
  }

  getRoleError(): string {
    if (!this.role?.touched) {
      return '';
    }

    if (this.role?.hasError('required')) {
      return 'role-required-error';
    }

    return '';
  }

  getCheckboxError(): string {
    if (!this.checkbox?.touched) {
      return '';
    }

    if (this.checkbox?.hasError('requiredTrue')) {
      return 'checkbox-requiredTrue-error';
    }

    return '';
  }
}
