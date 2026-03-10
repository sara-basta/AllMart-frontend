import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const role = auth.getUserRole(); 
  

  
  if (auth.getToken() && (role === 'ADMIN')) {
    return true;
  }

  router.navigate(['/']);
  return false;
};