import {
  afterNextRender,
  Component,
  ElementRef,
  HostListener,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, A11yModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  forgotPasswordForm = new FormGroup({
    emailID: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  get emailID() {
    return this.forgotPasswordForm.get('emailID');
  }

  continue = output<EmployeeInterface>();
  cancel = output<void>();

  private readonly authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private readonly emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');

  constructor() {
    afterNextRender(() => {
      this.emailInput()?.nativeElement.focus();
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.onContinue();
  }

  onCancel() {
    this.cancel.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.onCancel();
  }

  onContinue() {
    const email = this.forgotPasswordForm.getRawValue().emailID;

    this.authService.getEmployeeByEmail(email).subscribe({
      next: (employee) => {
        if (!employee) {
          this.toastr.error('Email does not exist');
          return;
        }
        this.toastr.success('Email Verified', 'Success');
        this.continue.emit(employee);
      },
      error: () => {
        this.toastr.error('Something went wrong', 'Error');
      },
    });
  }

  getEmailIDError(): string {
    if (!this.emailID?.touched) {
      return '';
    }

    if (this.emailID?.hasError('required')) {
      return 'emailID-required-error';
    }

    if (this.emailID?.hasError('email')) {
      return 'emailID-email-error';
    }

    return '';
  }
}
