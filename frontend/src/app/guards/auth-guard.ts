
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string | undefined;

  // Login pannala na Login page-ku redirect
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  const userRole = auth.getRole();

  // Role specify pannadha pages:
  // Admin and Staff rendu perum access pannalam
  if (!requiredRole) {
    if (userRole === 'Admin' || userRole === 'Staff') {
      return true;
    }

    return router.createUrlTree(['/']);
  }

  // Role-specific pages
  if (userRole !== requiredRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};
