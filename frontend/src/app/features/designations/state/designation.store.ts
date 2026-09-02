import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { DesignationInterface } from '../interfaces/designation.model';
import { DesignationsService } from '../services/designations.service';
import { CreateDesignationRequest } from '../interfaces/create-designation-request.model';
import { UpdateDesignationRequest } from '../interfaces/update-designation-request.model';

type DesignationState = {
  designations: DesignationInterface[];
  designationsLoading: boolean;
  designationsLoaded: boolean;
  updateSuccess: boolean;
  createSuccess: boolean;
  error: string | null;
};

const initialState: DesignationState = {
  designations: [],
  designationsLoading: false,
  designationsLoaded: false,
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
      loadDesignations(forceRefresh = false) {
        if (store.designationsLoaded() && !forceRefresh) {
          return;
        }
        patchState(store, {
          designationsLoading: true,
          error: null,
        });

        designationsService.getDesignations().subscribe({
          next: (response) => {
            patchState(store, {
              designations: response,
              designationsLoading: false,
              designationsLoaded: true,
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
            this.loadDesignations(true);
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
            this.loadDesignations(true);
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
        this.loadDesignations(true);
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
