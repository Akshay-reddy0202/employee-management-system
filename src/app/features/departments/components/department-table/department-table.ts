import { Component } from '@angular/core';
import { DepartmentRow } from '../department-row/department-row';

@Component({
  selector: 'app-department-table',
  imports: [DepartmentRow],
  templateUrl: './department-table.html',
  styleUrl: './department-table.css',
})
export class DepartmentTable {}
