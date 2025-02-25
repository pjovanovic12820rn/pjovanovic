import { Routes } from '@angular/router';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import {RegisterEmployeeComponent} from './components/register-employee/register-employee.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  {path: 'reset-password', component: PasswordResetComponent},
  { path: 'register', component: RegisterEmployeeComponent },
  { path: 'register-user', component: RegisterUserComponent }
];
