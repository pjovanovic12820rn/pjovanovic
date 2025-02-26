import { Injectable } from '@angular/core';
import { Employee, Message } from '../models/employee.model';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import { Paginated } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  isAdmin = true;
  private employeeUrl = 'http://localhost:8080/api/admin/employees';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployees(): Observable<Paginated<Employee>> {
    return this.http.get<Paginated<Employee>>(this.employeeUrl, { headers: this.getAuthHeaders() });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateEmployee(updatedEmployee: Employee): Observable<boolean> {
    return this.http.put<boolean>(`${this.employeeUrl}/${updatedEmployee.id}`, updatedEmployee,
      { headers: this.getAuthHeaders() }, );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.employeeUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deactivateEmployee(id: number): Observable<void> {
    return this.http.patch<void>(`${this.employeeUrl}/${id}/deactivate`, { headers: this.getAuthHeaders() }, );
  }

}
