import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { API_BASE_URL } from '../config/api.config';

const PROTECTED_PREFIXES = ['/admin/', '/auth/me', '/auth/logout'];

function needsAuth(request: HttpRequest<unknown>): boolean {
  if (!API_BASE_URL || !request.url.startsWith(API_BASE_URL)) return false;
  const path = request.url.slice(API_BASE_URL.length);
  return PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function withToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

/** Adds the admin access token to API admin calls and transparently refreshes it once on 401. */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!needsAuth(request)) return next(request);

  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken;
  if (!token) return next(request);

  return next(withToken(request, token)).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || request.url.endsWith('/auth/logout')) {
        return throwError(() => error);
      }
      return auth.refreshAccessToken().pipe(
        switchMap((fresh) => next(withToken(request, fresh))),
        catchError((refreshError: unknown) => {
          auth.clear();
          void router.navigate(['/admin/login'], { queryParams: { expired: 1 } });
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
