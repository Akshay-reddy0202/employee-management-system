import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(formGroup: AbstractControl): ValidationErrors | null {
  const createPasswordControl = formGroup.get('createPassword');
  const confirmPasswordControl = formGroup.get('confirmPassword');

  const password = createPasswordControl?.value;
  const confirmPassword = confirmPasswordControl?.value;

  if (!password || !confirmPassword) {
    return null;
  }

  if (password === confirmPassword) {
    return null;
  }

  return {
    passwordMismatch: true,
  };
  
}
