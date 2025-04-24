import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const employeeGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isEmployee() || authService.isAdmin() || authService.isSupervisor() || authService.isAgent())) {
    return true;
  }

  return router.parseUrl('/login');
}
