import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Department } from '../../interfaces/department.interface';
import { UpdateDepartmentRequest } from '../../interfaces/update-department-request.interface';

@Component({
  selector: 'app-department-table',
  imports: [MatIconModule],
  templateUrl: './department-table.html',
  styleUrl: './department-table.css',
})
export class DepartmentTable {
  public readonly departments = input.required<Department[]>();
  protected readonly edit = output<Department>();
  protected readonly delete = output<Department>();

  onEditClick(department: Department): void {
    this.edit.emit(department);
  }

  onDeleteClick(department: Department): void {
    this.delete.emit(department);
  }
}
