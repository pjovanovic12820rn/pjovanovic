import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard, adminGuard } from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [adminGuard] },
  { path: 'register-user', component: RegisterUserComponent, canActivate: [adminGuard] },
  { path: 'users/:id', component: EditUserComponent, canActivate: [adminGuard] },

  { path: 'employees', component: EmployeesComponent, canActivate: [adminGuard] },
  { path: 'register-employee', component: RegisterEmployeeComponent, canActivate: [adminGuard] },
  { path: 'employees/:id', component: EditEmployeeComponent, canActivate: [adminGuard] },

  { path: 'reset-password', component: PasswordResetComponent, canActivate: [adminGuard] },
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
];
