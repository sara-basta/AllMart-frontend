import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

export const sellerGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const role = auth.getUserRole()?.toUpperCase();

  if (auth.getToken() && role === 'SELLER') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
