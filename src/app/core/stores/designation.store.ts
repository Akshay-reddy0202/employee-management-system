import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { DesignationInterface } from '../../features/designations/interfaces/designation.model';
import { DesignationsService } from '../../features/designations/services/designations.service';
import { inject } from '@angular/core';
import { CreateDesignationRequest } from '../../features/designations/interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../../features/designations/interfaces/update-designation-request.model';

type DesignationState = {
  designations: DesignationInterface[];
  designationsLoading: boolean;
  updateSuccess: boolean;
  createSuccess: boolean;
  error: string | null;
};

const initialState: DesignationState = {
  designations: [],
  designationsLoading: false,
  updateSuccess: false,
  createSuccess: false,
  error: null,
};

export const DesignationStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store) => {
    const designationsService = inject(DesignationsService);

    return {
      loadDesignations() {
        patchState(store, {
          designationsLoading: true,
          error: null,
        });

        designationsService.getDesignations().subscribe({
          next: (response) => {
            patchState(store, {
              designations: response,
              designationsLoading: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              designationsLoading: false,
              error: error.message,
            });
          },
        });
      },

      createDesignation(designation: CreateDesignationRequest) {
        patchState(store, {
          createSuccess: false,
          error: null,
        });

        designationsService.createDesignations(designation).subscribe({
          next: () => {
            this.loadDesignations();
            patchState(store, {
              createSuccess: true,
            });
          },
          error: (error) => {
            patchState(store, {
              error: error.message,
              createSuccess: false,
            });
          },
        });
      },

      updateDesignation(designationId: string, request: UpdateDesignationRequest) {
        patchState(store, {
          updateSuccess: false,
          error: null,
        });
        designationsService.updateDesignations(designationId, request).subscribe({
          next: () => {
            this.loadDesignations();
            patchState(store, {
              updateSuccess: true,
            });
          },
          error: (error) => {
            patchState(store, {
              error: error.message,
              updateSuccess: false,
            });
          },
        });
      },

      refresh() {
        this.loadDesignations();
      },

      clearCreateSuccess() {
        patchState(store, {
          createSuccess: false,
        });
      },

      clearUpdateSuccess() {
        patchState(store, {
          updateSuccess: false,
        });
      },
    };
  }),
);
