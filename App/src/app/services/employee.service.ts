import { Injectable } from '@angular/core';
import { Employee, Message } from '../models/employee.model';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  isAdmin = true;
  private employeeUrl = 'http://localhost:8080/api/admin/employees';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // ✅ Attach JWT
      'Content-Type': 'application/json',
    });
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl, { headers: this.getAuthHeaders() });
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateEmployee(updatedEmployee: Employee): Observable<boolean> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.put<boolean>(`${this.employeeUrl}/${updatedEmployee.id}`, updatedEmployee,
      { headers: this.getAuthHeaders() }, );
  }

  deleteEmployee(id: number): Observable<void> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.delete<void>(`${this.employeeUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deactivateEmployee(id: number): Observable<void> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.patch<void>(`${this.employeeUrl}/${id}/deactivate`, { headers: this.getAuthHeaders() }, );
  }

}
