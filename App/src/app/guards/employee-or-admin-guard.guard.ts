import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employeeOrAdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isEmployee() || authService.isAdmin())) {
    return true;
  }

  return router.parseUrl('/login');
}
