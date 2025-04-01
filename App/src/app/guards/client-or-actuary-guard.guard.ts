import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const clientOrActuaryGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isClient() || authService.isActuary())) {
    return true;
  }

  return router.parseUrl('/login');
}
