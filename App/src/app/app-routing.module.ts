import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  { path: 'users', component: EmployeesComponent }, // Change after Users are added
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'register', component: RegisterEmployeeComponent },
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
