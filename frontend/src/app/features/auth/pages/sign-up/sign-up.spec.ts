import { ComponentFixture, TestBed } from '@angular/core/testing';

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SignUp } from './sign-up';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  const authServiceMock = {
    register: vi.fn(),
  };

  const toastrServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SignUp],

      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: ToastrService,
          useValue: toastrServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.signUpForm.valid).toBe(false);
  });

  it('should be valid when valid values are provided', () => {
    component.signUpForm.setValue({
      role: 'Employee',
      fullName: 'Akshay Reddy',
      dateOfBirth: '2003-02-02',
      emailID: 'akshay@gmail.com',
      createPassword: 'Akshay@123',
      confirmPassword: 'Akshay@123',
      checkbox: true,
    });

    expect(component.signUpForm.valid).toBe(true);
  });

  it('should keep the form invalid when all fields are empty', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(form).toBeTruthy();

    expect(component.signUpForm.invalid).toBe(true);
  });

  describe('Role field', () => {
    it('should have an empty role initially', () => {
      expect(component.role?.value).toBe('');
    });

    it('should validate role when a valid value is provided', () => {
      component.role?.setValue('Employee');

      expect(component.role?.valid).toBe(true);
    });

    it('should invalidate role when an empty value is provided', () => {
      component.role?.setValue('');

      expect(component.role?.valid).toBe(false);
      expect(component.role?.hasError('required')).toBe(true);
    });

    it('should display role error when no role is selected', () => {
      const select = fixture.nativeElement.querySelector('#role') as HTMLSelectElement;

      select.value = '';
      select.dispatchEvent(new Event('change'));
      select.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const roleError = Array.from(errors).find((error) =>
        error.textContent?.includes('Please select a role.'),
      );

      expect(roleError).toBeTruthy();
    });

    it('should not display role error when a valid role is selected', () => {
      const select = fixture.nativeElement.querySelector('#role') as HTMLSelectElement;

      select.value = 'Employee';
      select.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const roleError = Array.from(errors).find((error) =>
        error.textContent?.includes('Please select a role.'),
      );

      expect(roleError).toBeUndefined();
    });
  });

  describe('Full Name field', () => {
    it('should have an empty full name initially', () => {
      expect(component.fullName?.value).toBe('');
    });

    it('should validate full name when a valid value is provided', () => {
      component.fullName?.setValue('Akshay Reddy');

      expect(component.fullName?.valid).toBe(true);
    });

    it('should invalidate full name when an empty value is provided', () => {
      component.fullName?.setValue('');

      expect(component.fullName?.valid).toBe(false);
      expect(component.fullName?.hasError('required')).toBe(true);
    });

    it('should invalidate full name when invalid characters are provided', () => {
      component.fullName?.setValue('Akshay123');

      expect(component.fullName?.valid).toBe(false);
      expect(component.fullName?.hasError('invalidFullName')).toBe(true);
    });

    it('should display required error when full name is empty', () => {
      const input = fixture.nativeElement.querySelector('#fullName') as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const fullNameError = Array.from(errors).find((error) =>
        error.textContent?.includes('This field is required'),
      );
      expect(fullNameError).toBeTruthy();
    });

    it('should not display fullName error when a valid fullName is provided', () => {
      const input = fixture.nativeElement.querySelector('#fullName') as HTMLInputElement;

      input.value = 'Akshay Reddy';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const emailError = Array.from(errors).find((error) =>
        error.textContent?.includes('Full Name can contain only letters and spaces'),
      );
      expect(emailError).toBeUndefined();
    });
  });

  describe('Email ID field', () => {
    it('should have an empty email initially', () => {
      expect(component.emailID?.value).toBe('');
    });

    it('should validate email when a valid value is provided', () => {
      component.emailID?.setValue('akshay@gmail.com');

      expect(component.emailID?.valid).toBe(true);
    });

    it('should invalidate email when an empty value is provided', () => {
      component.emailID?.setValue('');

      expect(component.emailID?.valid).toBe(false);
      expect(component.emailID?.hasError('required')).toBe(true);
    });

    it('should invalidate email when an invalid value is provided', () => {
      component.emailID?.setValue('akshay');

      expect(component.emailID?.valid).toBe(false);
      expect(component.emailID?.hasError('email')).toBe(true);
    });

    it('should display email required error when the field is empty', () => {
      const input = fixture.nativeElement.querySelector('#emailID') as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const emailError = Array.from(errors).find((error) =>
        error.textContent?.includes('This field is required'),
      );

      expect(emailError).toBeTruthy();
    });

    it('should display email error when an invalid email is provided', () => {
      const input = fixture.nativeElement.querySelector('#emailID') as HTMLInputElement;

      input.value = 'akshay';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const emailError = Array.from(errors).find((error) =>
        error.textContent?.includes('Email Id is not valid'),
      );
      expect(emailError).toBeTruthy();
    });

    it('should not display email error when a valid email is provided', () => {
      const input = fixture.nativeElement.querySelector('#emailID') as HTMLInputElement;

      input.value = 'akshay@gmail.com';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const emailError = Array.from(errors).find((error) =>
        error.textContent?.includes('Email Id is not valid'),
      );

      expect(emailError).toBeUndefined();
    });
  });

  describe('Date of Birth field', () => {
    it('should have an empty date of birth initially', () => {
      expect(component.dateOfBirth?.value).toBe('');
    });

    it('should validate date of birth when a valid value is provided', () => {
      component.dateOfBirth?.setValue('2000-01-01');

      expect(component.dateOfBirth?.valid).toBe(true);
    });

    it('should invalidate date of birth when an empty value is provided', () => {
      component.dateOfBirth?.setValue('');

      expect(component.dateOfBirth?.valid).toBe(false);
      expect(component.dateOfBirth?.hasError('required')).toBe(true);
    });

    it('should invalidate date of birth when the employee is under 18', () => {
      component.dateOfBirth?.setValue('2015-01-01');

      expect(component.dateOfBirth?.valid).toBe(false);
      expect(component.dateOfBirth?.hasError('minimumAge')).toBe(true);
    });

    it('should display date of birth required error when the field is empty', () => {
      const input = fixture.nativeElement.querySelector('#dateOfBirth') as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const dateOfBirthError = Array.from(errors).find((error) =>
        error.textContent?.includes('Date of Birth is required'),
      );

      expect(dateOfBirthError).toBeTruthy();
    });

    it('should display age error when the employee is under 18', () => {
      const input = fixture.nativeElement.querySelector('#dateOfBirth') as HTMLInputElement;

      input.value = '2015-01-01';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const dateOfBirthError = Array.from(errors).find((error) =>
        error.textContent?.includes('Employee must be at least 18 years old'),
      );

      expect(dateOfBirthError).toBeTruthy();
    });

    it('should not display date of birth error when a valid date is provided', () => {
      const input = fixture.nativeElement.querySelector('#dateOfBirth') as HTMLInputElement;

      input.value = '2000-01-01';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const dateOfBirthError = Array.from(errors).find((error) =>
        error.textContent?.includes('Employee must be at least 18 years old'),
      );

      expect(dateOfBirthError).toBeUndefined();
    });
  });

  describe('Create Password field', () => {
    it('should have an empty create password initially', () => {
      expect(component.createPassword?.value).toBe('');
    });

    it('should validate create password when a valid value is provided', () => {
      component.createPassword?.setValue('Password@123');

      expect(component.createPassword?.valid).toBe(true);
    });

    it('should invalidate create password when an empty value is provided', () => {
      component.createPassword?.setValue('');

      expect(component.createPassword?.valid).toBe(false);
      expect(component.createPassword?.hasError('required')).toBe(true);
    });

    it('should invalidate create password when an invalid value is provided', () => {
      component.createPassword?.setValue('password@123');

      expect(component.createPassword?.valid).toBe(false);
      expect(component.createPassword?.hasError('invalidPassword')).toBe(true);
    });

    it('should invalidate create password when it exceeds 15 characters', () => {
      component.createPassword?.setValue('Password@12345678');

      expect(component.createPassword?.valid).toBe(false);
      expect(component.createPassword?.hasError('maxlength')).toBe(true);
    });

    it('should display create password required error when the field is empty', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes('This field is required'),
      );

      expect(passwordError).toBeTruthy();
    });

    it('should display create password error when an invalid value is provided', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      input.value = 'password@123';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes(
          'Password must contain:Uppercase,LowerCase,Number, Special Character,and at least 8 characters',
        ),
      );

      expect(passwordError).toBeTruthy();
    });

    it('should display create password error when it exceeds 15 characters', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      input.value = 'Password@12345678';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes('Password must not exceed 15 characters'),
      );

      expect(passwordError).toBeTruthy();
    });

    it('should not display create password error when a valid value is provided', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      input.value = 'Password@123';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes(
          'Password must contain: Uppercase, Lowercase, Number, Special Character, and at least 8 characters.',
        ),
      );

      expect(passwordError).toBeUndefined();
    });

    it('should toggle password visibility', () => {
      expect(component.showCreatePassword()).toBe(false);

      component.toggleCreatePassword();
      expect(component.showCreatePassword()).toBe(true);

      component.toggleCreatePassword();
      expect(component.showCreatePassword()).toBe(false);
    });

    it('should show the create password when the toggle button is clicked', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      const button = fixture.nativeElement.querySelector('.signUp__toggle') as HTMLButtonElement;

      expect(input.type).toBe('password');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('text');
    });

    it('should hide the create password when the toggle button is clicked again', () => {
      const input = fixture.nativeElement.querySelector('#createPassword') as HTMLInputElement;

      const button = fixture.nativeElement.querySelector('.signUp__toggle') as HTMLButtonElement;

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('text');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('password');
    });
  });

  describe('Confirm Password field', () => {
    it('should have an empty confirm password initially', () => {
      expect(component.confirmPassword?.value).toBe('');
    });

    it('should validate confirm password when a valid value is provided', () => {
      component.confirmPassword?.setValue('Password@123');

      expect(component.confirmPassword?.valid).toBe(true);
    });

    it('should invalidate confirm password when an empty value is provided', () => {
      component.confirmPassword?.setValue('');

      expect(component.confirmPassword?.valid).toBe(false);
      expect(component.confirmPassword?.hasError('required')).toBe(true);
    });

    it('should invalidate confirm password when it exceeds 15 characters', () => {
      component.confirmPassword?.setValue('Password@12345678');

      expect(component.confirmPassword?.valid).toBe(false);
      expect(component.confirmPassword?.hasError('maxlength')).toBe(true);
    });

    it('should display confirm password required error when the field is empty', () => {
      const input = fixture.nativeElement.querySelector('#confirmPassword') as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes('This field is required'),
      );

      expect(passwordError).toBeTruthy();
    });

    it('should display confirm password error when it exceeds 15 characters', () => {
      const input = fixture.nativeElement.querySelector('#confirmPassword') as HTMLInputElement;

      input.value = 'Password@12345678';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes('Password must not exceed 15 characters'),
      );

      expect(passwordError).toBeTruthy();
    });

    it('should not display confirm password field error when a valid value is provided', () => {
      const input = fixture.nativeElement.querySelector('#confirmPassword') as HTMLInputElement;

      input.value = 'Password@123';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordError = Array.from(errors).find((error) =>
        error.textContent?.includes('Password must not exceed 15 characters'),
      );

      expect(passwordError).toBeUndefined();
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword()).toBe(false);

      component.toggleConfirmPassword();

      expect(component.showConfirmPassword()).toBe(true);

      component.toggleConfirmPassword();

      expect(component.showConfirmPassword()).toBe(false);
    });

    it('should show the confirm password when the toggle button is clicked', () => {
      const input = fixture.nativeElement.querySelector('#confirmPassword') as HTMLInputElement;

      const buttons = fixture.nativeElement.querySelectorAll(
        '.signUp__toggle',
      ) as NodeListOf<HTMLButtonElement>;

      const button = buttons[1];

      expect(input.type).toBe('password');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('text');
    });

    it('should hide the confirm password when the toggle button is clicked again', () => {
      const input = fixture.nativeElement.querySelector('#confirmPassword') as HTMLInputElement;

      const buttons = fixture.nativeElement.querySelectorAll(
        '.signUp__toggle',
      ) as NodeListOf<HTMLButtonElement>;

      const button = buttons[1];
      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('text');

      button.click();
      fixture.detectChanges();

      expect(input.type).toBe('password');
    });
  });

  describe('Confirm Password validation', () => {
    it('should invalidate the form when passwords do not match', () => {
      component.createPassword?.setValue('Password@123');
      component.confirmPassword?.setValue('Password@456');

      expect(component.signUpForm.valid).toBe(false);
      expect(component.signUpForm.hasError('passwordMismatch')).toBe(true);
    });

    it('should validate the form when passwords match', () => {
      component.createPassword?.setValue('Password@123');
      component.confirmPassword?.setValue('Password@123');

      expect(component.signUpForm.hasError('passwordMismatch')).toBe(false);
    });

    it('should display confirm password error when passwords do not match', () => {
      const createPasswordInput = fixture.nativeElement.querySelector(
        '#createPassword',
      ) as HTMLInputElement;

      const confirmPasswordInput = fixture.nativeElement.querySelector(
        '#confirmPassword',
      ) as HTMLInputElement;

      createPasswordInput.value = 'Password@123';
      createPasswordInput.dispatchEvent(new Event('input'));

      confirmPasswordInput.value = 'Password@456';
      confirmPasswordInput.dispatchEvent(new Event('input'));
      confirmPasswordInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordMismatchError = Array.from(errors).find((error) =>
        error.textContent?.includes('Passwords do not match'),
      );

      expect(passwordMismatchError).toBeTruthy();
    });

    it('should not display confirm password error when passwords match', () => {
      const createPasswordInput = fixture.nativeElement.querySelector(
        '#createPassword',
      ) as HTMLInputElement;

      const confirmPasswordInput = fixture.nativeElement.querySelector(
        '#confirmPassword',
      ) as HTMLInputElement;

      createPasswordInput.value = 'Password@123';
      createPasswordInput.dispatchEvent(new Event('input'));

      confirmPasswordInput.value = 'Password@123';
      confirmPasswordInput.dispatchEvent(new Event('input'));
      confirmPasswordInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const passwordMismatchError = Array.from(errors).find((error) =>
        error.textContent?.includes('Passwords do not match'),
      );

      expect(passwordMismatchError).toBeUndefined();
    });
  });

  describe('Sign Up checkbox', () => {
    it('should be unchecked initially', () => {
      expect(component.checkbox?.value).toBe(false);
    });

    it('should validate checkbox when it is checked', () => {
      component.checkbox?.setValue(true);

      expect(component.checkbox?.valid).toBe(true);
    });

    it('should invalidate checkbox when it is not checked', () => {
      component.checkbox?.setValue(false);

      expect(component.checkbox?.valid).toBe(false);
      expect(component.checkbox?.hasError('required')).toBe(true);
    });

    it('should display checkbox error when it is not checked', () => {
      const checkbox = fixture.nativeElement.querySelector(
        '#termsAndConditions',
      ) as HTMLInputElement;

      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      checkbox.dispatchEvent(new Event('blur'));

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const checkboxError = Array.from(errors).find((error) =>
        error.textContent?.includes('Accept all the terms and condtions'),
      );

      expect(checkboxError).toBeTruthy();
    });

    it('should not display checkbox error when it is checked', () => {
      component.checkbox?.setValue(true);

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll(
        '.signUp__errors',
      ) as NodeListOf<HTMLElement>;

      const checkboxError = Array.from(errors).find((error) =>
        error.textContent?.includes('This field is required'),
      );

      expect(checkboxError).toBeUndefined();
    });
  });

  describe('Terms Modal', () => {
    it('should keep terms modal closed initially', () => {
      expect(component.isTermsModalOpen()).toBe(false);
    });

    it('should open terms modal when checkbox is clicked', () => {
      const checkbox = fixture.nativeElement.querySelector(
        '#termsAndConditions',
      ) as HTMLInputElement;
      expect(component.isTermsModalOpen()).toBe(false);

      checkbox.click();
      fixture.detectChanges();

      expect(component.isTermsModalOpen()).toBe(true);
      expect(component.checkbox?.value).toBe(false);
    });

    it('should keep checkbox unchecked when terms modal is opened', () => {
      const checkbox = fixture.nativeElement.querySelector(
        '#termsAndConditions',
      ) as HTMLInputElement;

      checkbox.click();
      fixture.detectChanges();

      expect(checkbox.checked).toBe(false);
      expect(component.checkbox?.value).toBe(false);
    });

    it('should close terms modal', () => {
      component.isTermsModalOpen.set(true);
      component.closeTermsModal();
      expect(component.isTermsModalOpen()).toBe(false);
    });

    it('should check the checkbox and close terms modal when terms are cancelled', () => {
      component.isTermsModalOpen.set(true);
      component.checkbox?.setValue(false);

      component.cancelTerms();

      expect(component.checkbox?.value).toBe(true);
      expect(component.isTermsModalOpen()).toBe(false);
    });
  });

  describe('on submit', () => {
    it('should not register when the form is invalid', () => {
      component.onSubmit();

      expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('should register when the form is valid', async () => {
      const formValue = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      const registerResponse = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        status: 'Active',
        createdAt: '2026-09-09',
      };

      authServiceMock.register.mockReturnValue(of(registerResponse));
      component.signUpForm.setValue(formValue);

      component.onSubmit();

      expect(authServiceMock.register).toHaveBeenCalledWith(formValue);
      expect(component['generatedEmployeeId']()).toBe('E0001');

      expect(component['isEmployeeIdDialogOpen']()).toBe(true);

      expect(component.signUpForm.value).toEqual({
        role: '',
        fullName: '',
        dateOfBirth: '',
        emailID: '',
        createPassword: '',
        confirmPassword: '',
        checkbox: false,
      });
    });

    it('should handle registration error when registration fails', () => {
      const formValue = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      const error = {
        message: 'Email already registered',
      };

      authServiceMock.register.mockReturnValue(throwError(() => error));

      component.signUpForm.setValue(formValue);

      component.onSubmit();

      expect(authServiceMock.register).toHaveBeenCalledWith(formValue);

      expect(toastrServiceMock.error).toHaveBeenCalledWith(
        'Email already registered',
        'Registration Failed',
      );

      expect(component.emailID?.hasError('emailExists')).toBe(true);
    });

    it('should call onSubmit when the form is submitted', () => {
      const submitSpy = vi.spyOn(component, 'onSubmit');

      const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

      form.dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(submitSpy).toHaveBeenCalled();
    });
  });

  describe('registration fails', () => {
    it('should handle registration error with status 409', () => {
      const formValue = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      const error = {
        status: 409,
        error: {
          message: 'An employee with this email already exists',
        },
      };

      authServiceMock.register.mockReturnValue(throwError(() => error));

      component.signUpForm.setValue(formValue);

      component.onSubmit();

      expect(authServiceMock.register).toHaveBeenCalledWith(formValue);

      expect(toastrServiceMock.error).toHaveBeenCalledWith(
        'An employee with this email already exists',
        'Registration Failed',
      );

      expect(component.emailID?.hasError('emailExists')).toBe(true);
      expect(component['isEmployeeIdDialogOpen']()).toBe(false);
    });
  });

  describe('EmployeeId Dialog', () => {
    it('should keep the employee ID dialog closed initially', () => {
      expect(component['isEmployeeIdDialogOpen']()).toBe(false);
    });

    it('should display the employee ID dialog after successful registration', () => {
      const registerResponse = {
        id: '1',
        employeeId: 'E0001',
        fullName: 'Akshay Reddy',
        emailID: 'akshay@gmail.com',
        role: 'Admin',
        status: 'Active',
        createdAt: '2026-09-09',
      };

      authServiceMock.register.mockReturnValue(of(registerResponse));

      component.signUpForm.setValue({
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      });

      component.onSubmit();
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('app-employee-id-dialog')).not.toBeNull();
    });
  });

  describe('Registration error handling', () => {
    it('should set emailExists error when error message contains email', () => {
      const formValue = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      authServiceMock.register.mockReturnValue(
        throwError(() => ({ message: 'This email is already in use' })),
      );

      component.signUpForm.setValue(formValue);
      component.onSubmit();

      expect(component.emailID?.hasError('emailExists')).toBe(true);
    });

    it('should not set emailExists error when error is unrelated to email', () => {
      const formValue = {
        role: 'Admin',
        fullName: 'Akshay Reddy',
        dateOfBirth: '2003-02-02',
        emailID: 'akshay@gmail.com',
        createPassword: 'Password@123',
        confirmPassword: 'Password@123',
        checkbox: true,
      };

      authServiceMock.register.mockReturnValue(
        throwError(() => ({ message: 'Internal Server Error' })),
      );

      component.signUpForm.setValue(formValue);
      component.onSubmit();

      expect(component.emailID?.hasError('emailExists')).toBeFalsy();
    });
  });
});
