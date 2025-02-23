import { Routes } from '@angular/router';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: LoginComponent,
  //   canActivate: [LoginGuard],
  // },
  {
       path: 'reset-password',
       component: PasswordResetComponent,
       // canActivate: [LoginGuard],
    },

];
