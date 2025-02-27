import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("Usao u authguard")

  // if (authService.isAuthenticated()) {
  //   return true;
  // }

  return router.parseUrl('/login');
};

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(authService.isAuthenticated())
  console.log(authService.isAdmin())

  if (authService.isAuthenticated() && authService.isAdmin()) {
    console.log('Uslov ispunjen')
    return true;
  }

  return router.parseUrl('/login'); // Redirect non-admins to login
};
