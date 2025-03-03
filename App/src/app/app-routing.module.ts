import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AccountsComponent } from './components/accounts/accounts.component';

export const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  { path: 'register-user', component: RegisterUserComponent },
  { path: '**', redirectTo: '' },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'register-employee', component: RegisterEmployeeComponent },
  { path: 'accounts', component: AccountsComponent },
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
