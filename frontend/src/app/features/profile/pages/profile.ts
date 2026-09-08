import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ProfileForm } from '../components/profile-form/profile-form';
import { Modal } from '../../../shared/components/modal/modal';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { ProfileStore } from '../state/profile.store';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';
import { InitialsPipePipe } from '../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-profile',
  imports: [ProfileForm, Modal, ConfirmationDialog, InitialsPipePipe, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected readonly isProfileFormOpen = signal(false);
  protected readonly isUnsavedChangesDialogOpen = signal(false);
  private readonly profileStore = inject(ProfileStore);
  protected readonly profileDetails = this.profileStore.profile;
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
    this.profileStore.loadProfile();
  }

  protected readonly departmentName = computed(() => {
    return this.profileDetails()?.department?.name ?? '-';
  });

  protected readonly designationName = computed(() => {
    return this.profileDetails()?.designation?.name ?? '-';
  });

  protected readonly managerName = computed(() => {
    return this.profileDetails()?.manager?.fullName ?? '-';
  });

  protected save(request: UpdateProfileRequest): void {
    this.profileStore.updateProfile(request, {
      onSuccess: () => {
        this.closeProfileForm();
        this.toastr.success('Profile updated successfully');
      },
      onError: (error) => {
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

    this.profileStore.uploadProfileImage(file, {
      onSuccess: (imageUrl) => {
        this.selectedImageUrl.set(imageUrl);
        this.toastr.success('Profile photo updated successfully');
        input.value = '';
      },
      onError: (error) => {
        this.toastr.error(error.message);
        input.value = '';
      },
    });
  }

  protected removeProfilePhoto(): void {
    this.profileStore.removeProfileImage({
      onSuccess: () => {
        this.selectedImageUrl.set(null);
        this.toastr.success('Profile photo removed successfully');
      },
      onError: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
