import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  isAdmin = true;

  private mockEmployees: Employee[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      birthDate: new Date('1990-05-20'),
      gender: 'M',
      email: 'john.doe@example.com',
      phoneNumber: '+381645555555',
      address: 'Njegoseva 25',
      username: 'john90',
      position: 'Manager',
      department: 'Finance',
      isActive: true,
      jmbg: '1234567890123'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      birthDate: new Date('1992-08-15'),
      gender: 'F',
      email: 'jane.doe@example.com',
      phoneNumber: '+381645555556',
      address: 'Some Other Street 10',
      username: 'jane92',
      position: 'Software Engineer',
      department: 'IT',
      isActive: true,
      jmbg: '9876543210987'
    },
    {
      id: 3,
      firstName: 'Peter',
      lastName: 'Smith',
      birthDate: new Date('1985-03-10'),
      gender: 'M',
      phoneNumber: '+381641234567',
      address: 'Another Street 5',
      username: 'petersmith',
      position: 'Accountant',
      department: 'Finance',
      isActive: false,
      email: 'peter.smith@example.com',
      jmbg: '4567890123456'
    }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployees(): Observable<Employee[]> {
    return of(this.mockEmployees);
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    const employee = this.mockEmployees.find(emp => emp.id === id);
    return of(employee);
  }

  updateEmployee(updatedEmployee: Employee): Observable<boolean> {
    // Check if the user has admin permissions
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }

    return of(true)
    // Make a PUT request to update the employee
    // return this.http.put<boolean>(`/api/admin/employees/${updatedEmployee.id}`, updatedEmployee);
  }

  deleteEmployee(id: number): Observable<void> {
    const index = this.mockEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      this.mockEmployees.splice(index, 1);
      return of(undefined);
    }
    return throwError(() => new Error('Employee not found'));
  }

  deactivateEmployee(id: number): Observable<void> {
    const employee = this.mockEmployees.find(emp => emp.id === id);
    if (employee) {
      employee.isActive = false;
      return of(undefined);
    }
    return throwError(() => new Error('Employee not found'));
  }

}
