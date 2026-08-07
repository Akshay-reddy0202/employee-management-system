import { Component, input } from '@angular/core';
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
}
