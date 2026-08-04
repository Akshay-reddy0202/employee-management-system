import { Component } from '@angular/core';
import { DepartmentModal } from '../components/department-modal/department-modal';
import { DepartmentTable } from '../components/department-table/department-table';

@Component({
  selector: 'app-departments',
  imports: [DepartmentTable],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {}
