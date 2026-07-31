import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function employeeIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const employeeIdPattern = /^E\d+$/;

    return employeeIdPattern.test(value) ? null : { invalidEmployeeId: true };
  };
}
