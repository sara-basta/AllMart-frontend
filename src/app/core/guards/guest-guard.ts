import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core'
import { Auth } from '../services/auth'

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if(auth.isLoggedIn()){
    router.navigate(['/']);
    return false;
  }

  return true;
};
