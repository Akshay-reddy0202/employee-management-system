import { Component, signal } from '@angular/core';
import { ProfileForm } from '../components/profile-form/profile-form';
import { Modal } from '../../../shared/components/modal/modal';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-profile',
  imports: [ProfileForm, Modal, ConfirmationDialog],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  protected readonly isProfileFormOpen = signal(false);
  protected readonly isUnsavedChangesDialogOpen = signal(false);

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
}
