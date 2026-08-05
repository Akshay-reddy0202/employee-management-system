import { Component, inject, signal } from '@angular/core';
import { DepartmentModal } from '../components/department-modal/department-modal';
import { DepartmentTable } from '../components/department-table/department-table';
import { DepartmentForm } from '../components/department-form/department-form';
import { CreateDepartmentRequest } from '../interfaces/create-department-request.interface';
import { DepartmentsService } from '../services/departments.service';
import { Department } from '../interfaces/department.interface';
import { Toast, ToastrService } from 'ngx-toastr';
import { UpdateDepartmentRequest } from '../interfaces/update-department-request.interface';

@Component({
  selector: 'app-departments',
  imports: [DepartmentTable, DepartmentForm, DepartmentModal],
  templateUrl: './departments.html',
  styleUrl: './departments.css',
})
export class Departments {
  protected readonly isDepartmentFormOpen = signal(false);
  private readonly departmentsService = inject(DepartmentsService);
  protected readonly departments = signal<Department[]>([]);
  private readonly toastr = inject(ToastrService);
  protected readonly selectedDepartment = signal<Department | null>(null);

  openCreateDepartmentForm(): void {
    this.selectedDepartment.set(null);
    this.isDepartmentFormOpen.set(true);
  }

  closeDepartmentForm(): void {
    this.isDepartmentFormOpen.set(false);
  }

  openEditDepartmentForm(department: Department): void {
    this.selectedDepartment.set(department);
    this.isDepartmentFormOpen.set(true);
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  private loadDepartments(): void {
    this.departmentsService.getDepartments().subscribe({
      next: (departments) => {
        this.departments.set(departments);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  private departmentCodeExists(code: string, ignoreDepartmentId?: number): boolean {
    return this.departments().some((department) => {
      const isSameCode = department.code.trim().toLowerCase() === code.trim().toLowerCase();

      const isDifferentDepartment = department.id !== ignoreDepartmentId;

      return isSameCode && isDifferentDepartment;
    });
  }

  save(request: CreateDepartmentRequest): void {
    if (this.selectedDepartment()) {
      this.updateDepartment(request);
    } else {
      this.createDepartment(request);
    }
  }

  private createDepartment(request: CreateDepartmentRequest): void {
    if (this.departmentCodeExists(request.code)) {
      this.toastr.error('Department code already exists');
    } else {
      this.departmentsService.createDepartment(request).subscribe({
        next: (createdDepartment: Department) => {
          this.toastr.success('Department created successfully');
          this.closeDepartmentForm();
          this.loadDepartments();
        },
        error: (error) => {
          this.toastr.error(error.message);
        },
      });
    }
  }

  private updateDepartment(request: UpdateDepartmentRequest): void {
    const selectedDepartment = this.selectedDepartment();

    if (!selectedDepartment) {
      return;
    }
    if (this.departmentCodeExists(request.code, selectedDepartment.id)) {
      this.toastr.error('Department code already exists');
      return;
    }
    this.departmentsService.updateDepartment(selectedDepartment.id, request).subscribe({
      next: () => {
        this.toastr.success('Department updated successfully');
        this.closeDepartmentForm();
        this.loadDepartments();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  onEditDepartment(department: Department): void {
    this.openEditDepartmentForm(department);
  }

  onDeleteDepartment(department: Department): void {
    this.departmentsService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.toastr.success('Department deleted successfully');
        this.loadDepartments();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
