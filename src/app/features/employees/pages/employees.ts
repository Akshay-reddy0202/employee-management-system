import { Component, inject, signal } from '@angular/core';
import { EmployeesTable } from '../components/employees-table/employees-table';
import { EmployeeService } from '../services/employee.service';
import { EmployeeInterface } from '../interfaces/employee.model';
import { ToastrService } from 'ngx-toastr';
import { EmployeeFormMode } from '../interfaces/employees-form-mode.type';
import { EmployeesForm } from '../components/employees-form/employees-form';
import { Modal } from '../../../shared/components/modal/modal';
import { UpdateEmployeeRequest } from '../interfaces/update-employee-request.model';

@Component({
  selector: 'app-employees',
  imports: [EmployeesTable, EmployeesForm, Modal],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees {
  private employeesService = inject(EmployeeService);
  private readonly toastr = inject(ToastrService);
  protected readonly employees = signal<EmployeeInterface[]>([]);
  protected selectedEmployee = signal<EmployeeInterface | null>(null);
  protected isEmployeeFormOpen = signal(false);
  protected readonly employeeFormMode = signal<EmployeeFormMode | null>(null);

  ngOnInit(): void {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  protected onEditEmployee(employee: EmployeeInterface): void {
    this.selectedEmployee.set(employee);
    this.isEmployeeFormOpen.set(true);
    this.employeeFormMode.set('edit');
  }

  protected onViewEmployee(employee: EmployeeInterface): void {
    this.selectedEmployee.set(employee);
    this.isEmployeeFormOpen.set(true);
    this.employeeFormMode.set('view');
  }

  protected closeEmployeeForm(): void {
    this.selectedEmployee.set(null);
    this.isEmployeeFormOpen.set(false);
    this.employeeFormMode.set(null);
  }

  protected onSaveEmployee(request: UpdateEmployeeRequest): void {
    const employee = this.selectedEmployee();
    if (!employee?.id) {
      return;
    }

    this.employeesService.updateEmployee(employee.id, request).subscribe({
      next: () => {
        this.toastr.success('Employee Updated Successfully');
        this.closeEmployeeForm();
        this.loadEmployees();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
