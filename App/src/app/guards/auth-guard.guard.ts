import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const employeeGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.isEmployee()) {
    return true;
  }

  return router.parseUrl('/login');
}

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  return router.parseUrl('/login'); // Redirect non-admins to login
};

export const employeeOrAdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isEmployee() || authService.isAdmin())) {
    return true;
  }

  return router.parseUrl('/login');
}

export const clientOrActuaryGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && (authService.isClient() || authService.isActuary())) {
    return true;
  }

  return router.parseUrl('/login');
}

export const supervisorGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated() && authService.isSupervisor()) {
    return true;
  }

  return router.parseUrl('/login');
}