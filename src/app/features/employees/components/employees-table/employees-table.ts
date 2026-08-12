import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeInterface } from '../../interfaces/employee.model';
import { DesignationInterface } from '../../../designations/interfaces/designation.model';
import { Department } from '../../../departments/interfaces/department.interface';

@Component({
  selector: 'app-employees-table',
  imports: [MatIconModule],
  templateUrl: './employees-table.html',
  styleUrl: './employees-table.css',
})
export class EmployeesTable {
  readonly employees = input.required<EmployeeInterface[]>();
  readonly designations = input.required<DesignationInterface[]>();
  readonly departments = input.required<Department[]>();
  protected readonly edit = output<EmployeeInterface>();
  protected readonly view = output<EmployeeInterface>();

  protected onEditClick(employee: EmployeeInterface): void {
    this.edit.emit(employee);
  }

  protected onViewClick(employee: EmployeeInterface): void {
    this.view.emit(employee);
  }

  protected getDesignationName(designationId: string | null | undefined): string {
    const designation = this.designations().find((designation) => designation.id === designationId);
    return designation?.name ?? '-';
  }

  protected getDepartmentName(departmentId: string | null | undefined): string {
    const department = this.departments().find((department) => department.id === departmentId);
    return department?.name ?? '-';
  }

  protected getManagerName(managerId: string | null | undefined): string {
    const manager = this.employees().find((employee) => employee.id === managerId);

    return manager?.fullName ?? '-';
  }


}
