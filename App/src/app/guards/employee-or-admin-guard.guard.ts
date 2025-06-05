import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employeeOrHigherRoleGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isEmployee() || authService.isAdmin() || authService.isSupervisor() || authService.isAgent())) {
    return true;
  }

  return router.parseUrl('/login');
}
