import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { EmployeeInterface } from '../../employees/interfaces/employee.model';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileRequest } from '../interfaces/update-profile-request.interface';

type ProfileState = {
  profile: EmployeeInterface | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  profile: null,
  loading: false,
  loaded: false,
  error: null,
};

export const ProfileStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store) => {
    const profileService = inject(ProfileService);

    return {
      loadProfile(forceRefresh = false) {
        if (store.loaded() && !forceRefresh) {
          return;
        }

        patchState(store, {
          loading: true,
          error: null,
        });

        profileService.getProfile().subscribe({
          next: (profile) => {
            patchState(store, {
              profile,
              loaded: true,
              loading: false,
              error: null,
            });
          },
          error: (error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
          },
        });
      },

      updateProfile(
        request: UpdateProfileRequest,
        callbacks?: { onSuccess?: (employee: EmployeeInterface) => void; onError?: (error: Error) => void },
      ) {
        patchState(store, { loading: true, error: null });

        profileService.updateProfile(request).subscribe({
          next: (employee) => {
            patchState(store, {
              profile: employee,
              loading: false,
              error: null,
            });
            callbacks?.onSuccess?.(employee);
          },
          error: (error) => {
            patchState(store, {
              loading: false,
              error: error.message,
            });
            callbacks?.onError?.(error);
          },
        });
      },

      uploadProfileImage(
        file: File,
        callbacks?: { onSuccess?: (url: string | null) => void; onError?: (error: Error) => void },
      ) {
        profileService.uploadProfileImage(file).subscribe({
          next: (response) => {
            const current = store.profile();
            if (current) {
              patchState(store, {
                profile: { ...current, profileImageUrl: response.profileImageUrl },
              });
            }
            callbacks?.onSuccess?.(response.profileImageUrl);
          },
          error: (error) => {
            callbacks?.onError?.(error);
          },
        });
      },

      removeProfileImage(callbacks?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
        profileService.removeProfileImage().subscribe({
          next: () => {
            const current = store.profile();
            if (current) {
              patchState(store, {
                profile: { ...current, profileImageUrl: null },
              });
            }
            callbacks?.onSuccess?.();
          },
          error: (error) => {
            callbacks?.onError?.(error);
          },
        });
      },

      refresh() {
        this.loadProfile(true);
      },

      clearProfile() {
        patchState(store, initialState);
      },
    };
  }),
);
