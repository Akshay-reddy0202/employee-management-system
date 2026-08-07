import { Component, inject, signal } from '@angular/core';
import { EmployeesTable } from '../components/employees-table/employees-table';
import { EmployeeService } from '../services/employee.service';
import { EmployeeInterface } from '../interfaces/employee.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employees',
  imports: [EmployeesTable],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  private employeesService = inject(EmployeeService);
  private readonly toastr = inject(ToastrService);
  protected readonly employees = signal<EmployeeInterface[]>([]);

  ngOnInit(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.toastr.success('Employees Loaded Successfully');
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
