import { Component, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Department } from '../../interfaces/department.interface';
import { DepartmentSortColumn, SortDirection } from '../../interfaces/department-sort.type';

@Component({
  selector: 'app-department-table',
  imports: [MatIconModule],
  templateUrl: './department-table.html',
  styleUrl: './department-table.css',
})
export class DepartmentTable {
  public readonly departments = input.required<Department[]>();
  readonly sort = output<DepartmentSortColumn>();
  protected readonly edit = output<Department>();
  protected readonly delete = output<Department>();
  readonly sortColumn = input<DepartmentSortColumn | null>(null);
  readonly sortDirection = input<SortDirection | null>(null);

  onEditClick(department: Department): void {
    this.edit.emit(department);
  }

  onDeleteClick(department: Department): void {
    this.delete.emit(department);
  }

  protected onSort(column: DepartmentSortColumn): void {
    this.sort.emit(column);
  }

  protected getSortIcon(column: DepartmentSortColumn): string {
    if (this.sortColumn() !== column) {
      return 'unfold_more';
    }

    return this.sortDirection() === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }
}
