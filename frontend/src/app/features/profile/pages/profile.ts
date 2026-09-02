import { Component, computed, inject, signal } from '@angular/core';
import { ProfileForm } from '../components/profile-form/profile-form';
import { Modal } from '../../../shared/components/modal/modal';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { ProfileService } from '../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';
import { InitialsPipePipe } from '../../../shared/pipes/initials.pipe';
import { EmployeeStore } from '../../employees/state/employee.store';
import { DesignationStore } from '../../designations/state/designation.store';
import { DepartmentsStore } from '../../departments/state/department.store';

@Component({
  selector: 'app-profile',
  imports: [ProfileForm, Modal, ConfirmationDialog, InitialsPipePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected readonly isProfileFormOpen = signal(false);
  protected readonly isUnsavedChangesDialogOpen = signal(false);
  private readonly profileService = inject(ProfileService);
  protected readonly profileDetails = signal<EmployeeInterface | null>(null);
  private readonly toastr = inject(ToastrService);
  protected readonly authService = inject(AuthService);
  protected readonly selectedImageUrl = signal<string | null>(null);

  private readonly employeeStore = inject(EmployeeStore);
  private readonly designationStore = inject(DesignationStore);
  private readonly departmentStore = inject(DepartmentsStore);

  protected readonly employees = this.employeeStore.allEmployees;
  protected readonly designations = this.designationStore.designations;
  protected readonly departments = this.departmentStore.allDepartments;

  protected openProfileForm(): void {
    this.isProfileFormOpen.set(true);
  }

  protected closeProfileForm(): void {
    this.isProfileFormOpen.set(false);
  }

  protected openUnsavedChangesDialog(): void {
    this.isUnsavedChangesDialogOpen.set(true);
  }

  protected continueEditing(): void {
    this.isUnsavedChangesDialogOpen.set(false);
  }

  protected discardChanges(): void {
    this.isUnsavedChangesDialogOpen.set(false);
    this.closeProfileForm();
  }

  ngOnInit(): void {
    this.loadProfile();
    this.employeeStore.loadAllEmployees();
    this.designationStore.loadDesignations();
    this.departmentStore.loadAllDepartments();
  }

  protected readonly departmentName = computed(() => {
    const profile = this.profileDetails();

    if (!profile) {
      return '';
    }
    return (
      this.departments().find((department) => department.id === profile.departmentId)?.name ?? '-'
    );
  });

  protected readonly designationName = computed(() => {
    const profile = this.profileDetails();

    if (!profile) {
      return '';
    }
    return (
      this.designations().find((designation) => designation.id === profile.designationId)?.name ??
      '-'
    );
  });

  protected readonly managerName = computed(() => {
    const profile = this.profileDetails();

    if (!profile) {
      return '';
    }

    return this.employees().find((employee) => employee.id === profile.managerId)?.fullName ?? '-';
  });

  private loadProfile(): void {
    const currentUser = this.authService.loggedInUser();
    if (!currentUser) {
      return;
    }
    this.profileService.getProfile(currentUser.id).subscribe({
      next: (profile) => {
        this.profileDetails.set(profile);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  protected save(request: UpdateProfileRequest): void {
    const currentUser = this.authService.loggedInUser();

    if (!currentUser) {
      return;
    }

    this.profileService.updateProfile(currentUser.id, request).subscribe({
      next: (employee) => {
        this.profileDetails.set(employee);
        this.closeProfileForm();
        this.toastr.success('profile updated successfully');
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  protected onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const imageUrl = URL.createObjectURL(file);
    this.selectedImageUrl.set(imageUrl);
  }
}
