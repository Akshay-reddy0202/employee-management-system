import { Component, computed, inject, signal } from '@angular/core';
import { DesignationTable } from '../components/designation-table/designation-table';
import { DesignationForm } from '../components/designation-form/designation-form';
import { Modal } from '../../../shared/components/modal/modal';
import { DesignationInterface } from '../interfaces/designation.model';
import { ToastrService } from 'ngx-toastr';
import { DesignationsService } from '../services/designations.service';
import { CreateDesignationRequest } from '../interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../interfaces/update-designation-request.model';
import { ConfirmationDialog } from '../../../shared/components/confirmation-dialog/confirmation-dialog';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { MatIconModule } from '@angular/material/icon';

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
  protected readonly designations = signal<DesignationInterface[]>([]);
  protected readonly isDesignationFormOpen = signal(false);
  protected readonly selectedDesignation = signal<DesignationInterface | null>(null);
  private readonly designationsService = inject(DesignationsService);
  private readonly toastr = inject(ToastrService);
  protected readonly searchTerm = signal('');
  protected readonly isUnsavedChangesDialogOpen = signal(false);

  protected refreshDesignations(): void {
    this.loadDesignations();
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

  ngOnInit(): void {
    this.loadDesignations();
  }

  private loadDesignations(): void {
    this.designationsService.getDesignations().subscribe({
      next: (designations) => {
        this.designations.set(designations);
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  protected save(request: CreateDesignationRequest): void {
    if (this.selectedDesignation()) {
      this.updateDesignation(request);
    } else {
      this.createDesignation(request);
    }
  }

  protected createDesignation(request: CreateDesignationRequest): void {
    this.designationsService.createDesignations(request).subscribe({
      next: () => {
        this.toastr.success('Designation Created Successfully');
        this.closeDesignationForm();
        this.loadDesignations();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }

  protected updateDesignation(request: UpdateDesignationRequest): void {
    const selectedDesignation = this.selectedDesignation();
    if (!selectedDesignation?.id) {
      return;
    }
    this.designationsService.updateDesignations(selectedDesignation.id, request).subscribe({
      next: () => {
        this.toastr.success('Designation updated successfully');
        this.closeDesignationForm();
        this.loadDesignations();
      },
      error: (error) => {
        this.toastr.error(error.message);
      },
    });
  }
}
