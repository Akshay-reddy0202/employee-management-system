import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isApiUrl = req.url.startsWith(environment.apiUrl);
  let authReq = req;

  if (isApiUrl) {
    const token = authService.getAccessToken();
    const headersConfig: Record<string, string> = {};

    if (token && !req.headers.has('Authorization')) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    authReq = req.clone({
      withCredentials: true,
      setHeaders: headersConfig,
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthRoute =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh') ||
        req.url.includes('/auth/forgot-password') ||
        req.url.includes('/auth/reset-password');

      if (error.status === 401 && isApiUrl && !isAuthRoute) {
        return authService.refreshToken().pipe(
          switchMap((newTokenData) => {
            const retryReq = req.clone({
              withCredentials: true,
              setHeaders: {
                Authorization: `Bearer ${newTokenData.accessToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.logout();
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
