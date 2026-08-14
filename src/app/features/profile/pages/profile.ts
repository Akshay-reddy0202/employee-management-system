import { Component, inject, signal } from '@angular/core';
import { ProfileForm } from '../components/profile-form/profile-form';
import { Modal } from '../../../shared/components/modal/modal';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { ProfileService } from '../services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';
import { InitialsPipePipe } from '../../../shared/pipes/initials.pipe';

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
  }

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
