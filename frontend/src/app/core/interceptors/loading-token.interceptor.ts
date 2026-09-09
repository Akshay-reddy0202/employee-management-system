import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
export const SHOW_LOADER = new HttpContextToken<boolean>(() => false);

export const loadingTokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
