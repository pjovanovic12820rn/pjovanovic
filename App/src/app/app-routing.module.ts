import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import {RegisterEmployeeComponent} from './components/register-employee/register-employee.component';

export const routes: Routes = [
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  { path: 'register', component: RegisterEmployeeComponent }
];
