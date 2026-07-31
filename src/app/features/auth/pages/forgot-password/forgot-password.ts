import { Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmployeeInterface } from '../../../employees/models/employee.model';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
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

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.onContinue();
  }

  continue = output<EmployeeInterface>();
  cancel = output<void>();

  onCancel() {
    this.cancel.emit();
  }

  private readonly authService = inject(AuthService);
  private toastr = inject(ToastrService);

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
}
