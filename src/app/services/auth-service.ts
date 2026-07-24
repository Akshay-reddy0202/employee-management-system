import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { SignupRequestInterface } from '../models/signup-request-interface';
import { Observable } from 'rxjs';
import { EmployeeInterface } from '../models/employee-interface';
import { environment } from '../../environments/environment';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  register(signUpForm: SignupRequestInterface): Observable<EmployeeInterface> {
    const employee: EmployeeInterface = {
      employeeId: crypto.randomUUID(),
      fullName: signUpForm.fullName,
      emailID: signUpForm.emailID,
      password: signUpForm.createPassword,
      role: signUpForm.role,
    };
    return this.http.post<EmployeeInterface>(this.apiUrl, employee);
  }
}
