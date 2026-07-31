import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { SHOW_LOADER } from './loading-token.interceptor';
import { LoaderService } from '../services/loader.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const shouldShowLoader = req.context.get(SHOW_LOADER);

  if (shouldShowLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    delay(1000),
    finalize(() => {
      if (shouldShowLoader) {
        loaderService.hide();
      }
    }),
  );
};
