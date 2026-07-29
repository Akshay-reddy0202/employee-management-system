import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(formGroup: AbstractControl): ValidationErrors | null {
  const createPasswordControl = formGroup.get('createPassword');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  const createPassword = createPasswordControl?.value;
  const confirmPassword = confirmPasswordControl?.value;

  if (!createPassword || !confirmPassword) {
    return null;
  }

  if (createPassword === confirmPassword) {
    return null;
  }

  return {
    passwordMismatch: true,
  };
  
}
