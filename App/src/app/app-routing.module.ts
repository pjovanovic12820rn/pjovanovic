import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {authGuard, adminGuard, employeeGuard} from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { UsersComponent } from './components/users/users.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import {EmployeeDetailComponent} from './components/employee-detail/employee-detail.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {SuccessComponent} from './components/success/success.component';
import { MailComponent } from './components/mail/mail.component';
import {AccountCreationComponent} from './components/account-creation/account-creation.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent, canActivate: [employeeGuard]}, //, canActivate: [adminGuard]
  { path: 'register-user', component: RegisterUserComponent, canActivate: [employeeGuard] }, //, canActivate: [adminGuard]
  { path: 'users/:id', component: EditUserComponent, canActivate: [adminGuard] },
  { path: 'user/:id', component: UserDetailComponent },

  { path: 'employees', component: EmployeesComponent, canActivate: [adminGuard] },
  { path: 'register-employee', component: RegisterEmployeeComponent, canActivate: [adminGuard] },
  { path: 'employees/:id', component: EditEmployeeComponent, canActivate: [adminGuard] },
  { path: 'employee/:id', component: EmployeeDetailComponent },

  { path: 'forgot-password', component: MailComponent },
  { path: 'set-password', component: PasswordResetComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:type', component: LoginComponent },

  {path: 'account-creation', component: AccountCreationComponent, canActivate: [employeeGuard]}
];
