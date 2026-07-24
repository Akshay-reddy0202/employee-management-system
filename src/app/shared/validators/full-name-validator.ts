import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fullNameValidator():ValidatorFn {
    return (control:AbstractControl):ValidationErrors|null=>{
        const value = control.value;
    
    if(!value){
        return null ;
    }

    const FULL_NAME_PATTERN = /^[A-Za-z\s]+$/;

    return FULL_NAME_PATTERN.test(value)
      ? null
      : { invalidFullName: true };
  };
}
