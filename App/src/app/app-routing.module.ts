import { Routes } from '@angular/router';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

export const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EditEmployeeComponent },
  { path: 'register', component: RegisterEmployeeComponent },
  { path: 'user/:id', component: UserDetailComponent },
  { path: '**', redirectTo: '' }
];
