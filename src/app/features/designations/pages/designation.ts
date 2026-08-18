import { Component, computed, effect, inject, signal } from '@angular/core';
import { DesignationTable } from '../components/designation-table/designation-table';
import { DesignationForm } from '../components/designation-form/designation-form';
import { Modal } from '../../../shared/components/modal/modal';
import { DesignationInterface } from '../interfaces/designation.model';
import { ToastrService } from 'ngx-toastr';
import { CreateDesignationRequest } from '../interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../interfaces/update-designation-request.model';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { MatIconModule } from '@angular/material/icon';
import { DesignationStore } from '../../../core/stores/designation.store';

@Component({
  selector: 'app-designation',
  imports: [
    DesignationTable,
    DesignationForm,
    Modal,
    ConfirmationDialog,
    EmptyState,
    MatIconModule,
  ],
  templateUrl: './designation.html',
  styleUrl: './designation.css',
})
export class Designation {
  private readonly designationStore = inject(DesignationStore);
  protected readonly designations = this.designationStore.designations;
  protected readonly error = this.designationStore.error;
  protected readonly createSuccess = this.designationStore.createSuccess;
  protected readonly updateSuccess = this.designationStore.updateSuccess;

  protected readonly isDesignationFormOpen = signal(false);
  protected readonly selectedDesignation = signal<DesignationInterface | null>(null);

  private readonly toastr = inject(ToastrService);
  protected readonly searchTerm = signal('');
  protected readonly isUnsavedChangesDialogOpen = signal(false);

  constructor() {
    effect(() => {
      const error = this.designationStore.error();
      if (error) {
        this.toastr.error(error);
      }

      if (this.createSuccess()) {
        this.toastr.success('Designation created successfully');
        this.closeDesignationForm();
        this.designationStore.clearCreateSuccess();
      }

      if (this.updateSuccess()) {
        this.toastr.success('Designation updated successfully');
        this.closeDesignationForm();
        this.designationStore.clearUpdateSuccess();
      }
    });
  }

  ngOnInit(): void {
    this.designationStore.refresh();
  }

  protected refreshDesignations(): void {
    this.designationStore.refresh();
  }

  protected openDesignationForm(): void {
    this.selectedDesignation.set(null);
    this.isDesignationFormOpen.set(true);
  }

  protected closeDesignationForm(): void {
    this.selectedDesignation.set(null);
    this.isDesignationFormOpen.set(false);
  }

  protected editDesignation(designation: DesignationInterface): void {
    this.selectedDesignation.set(designation);
    this.isDesignationFormOpen.set(true);
  }

  protected onUnsavedChangesDialog(): void {
    this.isUnsavedChangesDialogOpen.set(true);
  }

  protected discardChanges(): void {
    this.isUnsavedChangesDialogOpen.set(false);
    this.closeDesignationForm();
  }

  protected continueEditing(): void {
    this.isUnsavedChangesDialogOpen.set(false);
  }

  protected readonly hasDesignations = computed(() => {
    return this.designations().length > 0;
  });

  protected openCreateDesignationForm(): void {
    this.selectedDesignation.set(null);
    this.isDesignationFormOpen.set(true);
  }

  protected readonly searchedDesignations = computed(() => {
    const designations = [...this.designations()];
    const search = this.searchTerm().trim().toLowerCase();

    if (!search) {
      return designations;
    }

    return designations.filter((designation) => designation.name.toLowerCase().includes(search));
  });

  protected save(request: CreateDesignationRequest): void {
    if (this.selectedDesignation()) {
      this.updateDesignation(request);
    } else {
      this.createDesignation(request);
    }
  }

  protected createDesignation(request: CreateDesignationRequest): void {
    this.designationStore.createDesignation(request);
  }

  protected updateDesignation(request: UpdateDesignationRequest): void {
    const selectedDesignation = this.selectedDesignation();
    if (!selectedDesignation?.id) {
      return;
    }
    this.designationStore.updateDesignation(selectedDesignation.id, request);
  }
}
