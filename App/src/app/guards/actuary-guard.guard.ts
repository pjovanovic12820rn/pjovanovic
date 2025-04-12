import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export const actuaryGuard: CanActivateFn = ():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isActuary()) {
    return true;
  } else {
    console.warn('Access denied by actuaryGuard. Redirecting to login.');
    return router.parseUrl('/login/employee');
  }
};