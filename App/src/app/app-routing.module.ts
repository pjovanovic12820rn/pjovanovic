import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [LoginGuard], // TODO
  },

];
