import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
import { AuthService } from '../../../../core/services/auth.service';
import { confirmPasswordValidator } from '../../../../shared/validators/confirm-password.validator';
import { passwordValidator } from '../../../../shared/validators/password.validator';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, A11yModule],
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

  employee = input<EmployeeInterface | null>(null);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly token = signal<string | null>(null);
  showCreatePassword = signal(false);
  showConfirmPassword = signal(false);
  private readonly createPasswordInput =
    viewChild<ElementRef<HTMLInputElement>>('createPasswordInput');

  constructor() {
    afterNextRender(() => {
      this.createPasswordInput()?.nativeElement.focus();
    });
  }

  ngOnInit(): void {
    const queryToken = this.activatedRoute.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.token.set(queryToken);
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const token = this.token();
    if (!token) {
      this.toastr.error('Password reset token is missing or invalid. Please request a new link.', 'Error');
      return;
    }

    const { createPassword, confirmPassword } = this.resetPasswordForm.getRawValue();

    this.authService.resetPasswordWithToken(token, createPassword, confirmPassword).subscribe({
      next: (response) => {
        this.toastr.success(response.message || 'Password reset successfully', 'Success');
        this.onCompleted();
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        const message = error.error?.message || error.message || 'Password update failed';
        this.toastr.error(message, 'Error');
      },
    });
  }

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
    this.router.navigate(['/sign-in']);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  onCompleted(): void {
    this.completed.emit();
  }

  getCreatePasswordError(): string {
    if (this.createPassword?.touched) {
      return '';
    }

    if (this.createPassword?.hasError('required')) {
      return 'createPassword-required-error';
    }

    if (this.createPassword?.hasError('maxLength')) {
      return 'createPassword-maxLength-error';
    }

    if (this.createPassword?.hasError('invalidPassword')) {
      return 'createPassword-invalidPassword-error';
    }

    return '';
  }

  getConfirmPasswordError(): string {
    if (this.confirmPassword?.touched) {
      return '';
    }

    if (this.confirmPassword?.hasError('required')) {
      return 'confirmPassword-required-error';
    }

    if (this.confirmPassword?.hasError('maxLength')) {
      return 'confirmPassword-maxLength-error';
    }

    if (this.confirmPassword?.hasError('passwordMismatch')) {
      return 'confirmPassword-passwordMismatch-error';
    }

    return '';
  }
}
