import { Routes } from '@angular/router';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import {RegisterEmployeeComponent} from './components/register-employee/register-employee.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
<<<<<<< HEAD
  {path: 'reset-password', component: PasswordResetComponent},
=======
  { path: 'register', component: RegisterEmployeeComponent }
>>>>>>> 9caecb05d01a2997d42712b42aab3023ecc403a4
];
