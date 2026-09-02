import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignIn } from './sign-in';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';
import { By } from '@angular/platform-browser';
import { ForgotPassword } from '../../components/forgot-password/forgot-password';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { provideRouter, Router } from '@angular/router';
import { ThemeService } from '../../../../core/services/theme.service';
import { of, throwError } from 'rxjs';

describe('SignIn', () => {
  let component: SignIn;
  let fixture: ComponentFixture<SignIn>;

  const authServiceMock = {
    login: vi.fn(),
    saveCurrentUser: vi.fn(),
  };

  const toastrServiceMock = {
    success: vi.fn(),
    error: vi.fn(),
  };

  const themeServiceMock = {
    setTheme: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [SignIn],
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
        {
          provide: ThemeService,
          useValue: themeServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should be valid when valid values are provided', () => {
    component.loginForm.setValue({
      employeeId: 'E0001',
      password: 'Akshay@123',
      checkbox: true,
    });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should make the form valid when valid values are entered in the rendered form', () => {
    const employeeIdInput = fixture.nativeElement.querySelector('#employeeId') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    const checkbox = fixture.nativeElement.querySelector('#remember_me') as HTMLInputElement;

    employeeIdInput.value = 'E0001';
    employeeIdInput.dispatchEvent(new Event('input'));

    passwordInput.value = 'Akshay@123';
    passwordInput.dispatchEvent(new Event('input'));

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    fixture.detectChanges();

    expect(component.loginForm.valid).toBe(true);
  });

  it('should keep the form invalid when required fields are empty', () => {
    const employeeIdInput = fixture.nativeElement.querySelector('#employeeId') as HTMLInputElement;
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    const checkbox = fixture.nativeElement.querySelector('#remember_me') as HTMLInputElement;

    employeeIdInput.value = '';
    employeeIdInput.dispatchEvent(new Event('input'));

    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    expect(component.loginForm.valid).toBe(false);
  });

  it('should invalidate employee ID when an invalid value is provied', () => {
    component.employeeId?.setValue('A0002');
    expect(component.employeeId?.valid).toBe(false);
  });

  it('should validate employeeID when an valid id is provided', () => {
    component.employeeId?.setValue('E0001');
    expect(component.employeeId?.valid).toBe(true);
  });

  it('should inValidate password when an invalid value is provided', () => {
    component.password?.setValue('password@123');
    expect(component.password?.valid).toBe(false);
  });

  it('should validate password when an valid value is provided', () => {
    component.password?.setValue('Password@123');
    expect(component.password?.valid).toBe(true);
  });

  it('should invalidate password when it exceeds 15 characters', () => {
    component.password?.setValue('Password@123456789');
    expect(component.password?.valid).toBe(false);
  });

  it('should display password error when an invalid value is given', () => {
    const input = fixture.nativeElement.querySelector('#password') as HTMLInputElement;

    input.value = 'password@123';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.login__error',
    ) as NodeListOf<HTMLElement>;
    const passwordError = Array.from(errors).find((error) =>
      error.textContent?.includes(
        'Password must contain:Uppercase,LowerCase,Number, Special Character,and at least 8 characters',
      ),
    );
    expect(passwordError).toBeTruthy();
  });

  it('should display password error when empty value is given', () => {
    const input = fixture.nativeElement.querySelector('#password') as HTMLInputElement;

    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.login__error',
    ) as NodeListOf<HTMLElement>;
    const passwordError = Array.from(errors).find((error) =>
      error.textContent?.includes('This field is required'),
    );
    expect(passwordError).toBeTruthy();
  });

  it('should display password error when it exceeds 15 characters', () => {
    const input = fixture.nativeElement.querySelector('#password') as HTMLInputElement;

    input.value = 'Password@12345678';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.login__error',
    ) as NodeListOf<HTMLElement>;
    const passwordError = Array.from(errors).find((error) =>
      error.textContent?.includes('Password must not exceed 15 characters'),
    );
    expect(passwordError).toBeTruthy();
  });

  it('should invalidate checkbox when it is not checked', () => {
    component.checkbox?.setValue(false);

    expect(component.checkbox?.valid).toBe(false);
  });

  it('should validate checkbox when it is checked', () => {
    component.checkbox?.setValue(true);

    expect(component.checkbox?.valid).toBe(true);
  });

  it('should display checkbox error when it is not checked', () => {
    const checkbox = fixture.nativeElement.querySelector('#remember_me') as HTMLInputElement;

    checkbox.checked = false;

    checkbox.dispatchEvent(new Event('change'));
    checkbox.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.login__error',
    ) as NodeListOf<HTMLElement>;

    const checkboxError = Array.from(errors).find((error) =>
      error.textContent?.includes('Accept all the terms and condtions'),
    );

    expect(checkboxError).toBeTruthy();
  });

  it('should not display checkbox error when it is checked', () => {
    const checkbox = fixture.nativeElement.querySelector('#remember_me') as HTMLInputElement;

    checkbox.checked = true;

    checkbox.dispatchEvent(new Event('change'));
    checkbox.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll(
      '.login__error',
    ) as NodeListOf<HTMLElement>;

    const checkboxError = Array.from(errors).find((error) =>
      error.textContent?.includes('Accept all the terms and condtions'),
    );

    expect(checkboxError).toBeUndefined();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePassword();
    expect(component.showPassword()).toBe(true);

    component.togglePassword();
    expect(component.showPassword()).toBe(false);
  });

  it('should show the password when the toggle button is clicked', () => {
    const input = fixture.nativeElement.querySelector('#password');
    const button = fixture.nativeElement.querySelector('.login__toggle');

    expect(input.type).toBe('password');

    button.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });

  it('should hide the password when the toggle button is clicked', () => {
    const input = fixture.nativeElement.querySelector('#password');
    const button = fixture.nativeElement.querySelector('.login__toggle');

    button.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');

    button.click();
    fixture.detectChanges();

    expect(input.type).toBe('password');
  });

  it('should open the forgot password modal', () => {
    expect(component.showForgotPassword()).toBe(false);

    component.openForgotPassword();
    expect(component.showForgotPassword()).toBe(true);
  });

  it('should close the forgot password modal', () => {
    component.openForgotPassword();
    expect(component.showForgotPassword()).toBe(true);

    component.closeForgotPassword();
    expect(component.showForgotPassword()).toBe(false);
  });

  it('should open the forgot password modal when clickded', () => {
    expect(component.showForgotPassword()).toBe(false);

    const event = new MouseEvent('click');
    component.onForgotPasswordClick(event);

    expect(component.showForgotPassword()).toBe(true);
  });

  it('should prevent the default action when forgot password is clicked', () => {
    const event = new MouseEvent('click');
    vi.spyOn(event, 'preventDefault');

    component.onForgotPasswordClick(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should open the forgot password modal when the button is clicked', () => {
    const button = fixture.nativeElement.querySelector(
      '.login__forgotPassword-button',
    ) as HTMLButtonElement;

    expect(fixture.nativeElement.querySelector('app-forgot-password')).toBeNull();

    button.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-forgot-password')).not.toBeNull();
  });

  it('should open the reset password modal', () => {
    const employee = {
      id: '1',
      employeeId: 'E0001',
      fullName: 'Akshay',
      dateOfBirth: '02-02-2003',
      emailID: 'akshay@gmail.com',
      role: 'Admin',
      password: 'Akshay@123',
    } as EmployeeInterface;
    expect(component.showResetPassword()).toBe(false);

    component.openResetPassword(employee);

    expect(component.showResetPassword()).toBe(true);
    expect(component.showForgotPassword()).toBe(false);
    expect(component.selectedEmployee()).toBe(employee);
  });

  it('should close the reset password modal', () => {
    component.showResetPassword.set(true);

    component.closeResetPassword();

    expect(component.showResetPassword()).toBe(false);
  });

  it('should close the reset password modal and clear selected employee when completed', () => {
    const employee = {
      id: '1',
      employeeId: 'E0001',
      fullName: 'Akshay',
      dateOfBirth: '02-02-2003',
      emailID: 'akshay@gmail.com',
      role: 'Admin',
      password: 'Akshay@123',
    } as EmployeeInterface;

    component.openResetPassword(employee);

    expect(component.showResetPassword()).toBe(true);
    expect(component.selectedEmployee()).toBe(employee);

    component.onResetPasswordCompleted();

    expect(component.showResetPassword()).toBe(false);
    expect(component.selectedEmployee()).toBeNull();
  });

  it('should open the reset password modal when the forgot password emits continue', () => {
    const employee = {
      id: '1',
      employeeId: 'E0001',
      fullName: 'Akshay',
      dateOfBirth: '02-02-2003',
      emailID: 'akshay@gmail.com',
      role: 'Admin',
      password: 'Akshay@123',
    } as EmployeeInterface;

    component.openForgotPassword();
    fixture.detectChanges();

    const forgotPasswordDebugElement = fixture.debugElement.query(By.directive(ForgotPassword));

    expect(forgotPasswordDebugElement).not.toBeNull();

    const forgotPasswordComponent = forgotPasswordDebugElement.componentInstance as ForgotPassword;

    forgotPasswordComponent.continue.emit(employee);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-reset-password')).not.toBeNull();

    expect(component.selectedEmployee()).toBe(employee);
    expect(component.showResetPassword()).toBe(true);
  });

  it('should not call login when the form is invalid', () => {
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  it('should login successfully when the form is valid', async () => {
    const employee = {
      id: '1',
      employeeId: 'E0001',
      fullName: 'Akshay',
      dateOfBirth: '02-02-2003',
      emailID: 'akshay@gmail.com',
      role: 'Admin',
      password: 'Akshay@123',
      theme: 'light',
    } as EmployeeInterface;

    authServiceMock.login.mockReturnValue(of(employee));
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate');

    component.loginForm.setValue({
      employeeId: 'E0001',
      password: 'Akshay@123',
      checkbox: true,
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      employeeId: 'E0001',
      password: 'Akshay@123',
      checkbox: true,
    });

    expect(authServiceMock.saveCurrentUser).toHaveBeenCalledWith(employee);
    expect(themeServiceMock.setTheme).toHaveBeenCalledWith('light');

    expect(toastrServiceMock.success).toHaveBeenCalledWith('Login Success', 'Success');
    expect(navigate).toHaveBeenCalledWith(['/dashboard']);

    expect(component.loginForm.value.employeeId).toBe('E');
    expect(component.loginForm.value.password).toBe('');
    expect(component.loginForm.value.checkbox).toBe(false);
  });

  it('should display error toast when login fails', () => {
    const error = {
      message: 'Invalid employee ID or password',
    };

    authServiceMock.login.mockReturnValue(throwError(() => error));

    component.loginForm.setValue({
      employeeId: 'E0001',
      password: 'Akshay@123',
      checkbox: true,
    });

    component.onSubmit();

    expect(toastrServiceMock.error).toHaveBeenCalledWith(
      'Invalid employee ID or password',
      'Login Failed',
    );
  });
});
