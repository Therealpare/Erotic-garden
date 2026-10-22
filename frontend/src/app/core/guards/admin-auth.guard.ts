import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Client-side convenience only — every admin API endpoint enforces auth on the server. */
export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  return inject(Router).createUrlTree(['/admin/login'], { queryParams: { returnUrl: state.url } });
};
