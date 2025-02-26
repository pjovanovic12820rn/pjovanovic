import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';


export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'register', component: RegisterEmployeeComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: EditUserComponent },
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
