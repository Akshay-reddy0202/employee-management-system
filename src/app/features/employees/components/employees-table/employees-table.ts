import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeInterface } from '../../interfaces/employee.model';

@Component({
  selector: 'app-employees-table',
  imports: [MatIconModule],
  templateUrl: './employees-table.html',
  styleUrl: './employees-table.css',
})
export class EmployeesTable {
  readonly employees = input.required<EmployeeInterface[]>();
  protected readonly edit = output<EmployeeInterface>();
  protected readonly view = output<EmployeeInterface>();

  protected onEditClick(employee: EmployeeInterface): void {
    this.edit.emit(employee);
  }

  protected onViewClick(employee: EmployeeInterface): void {
    this.view.emit(employee);
  }
}
