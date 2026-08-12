import { Component, input, output } from '@angular/core';
import { EmployeeInterface } from '../../../employees/interfaces/employee.model';

@Component({
  selector: 'app-department-employees',
  imports: [],
  templateUrl: './department-employees.html',
  styleUrl: './department-employees.css',
})
export class DepartmentEmployees {
  protected readonly employees = input.required<EmployeeInterface[]>();
  protected readonly close = output<void>();

  protected onClose(): void {
    this.close.emit();
  }
}
