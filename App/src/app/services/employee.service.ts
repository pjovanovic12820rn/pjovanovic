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
  private apiUrl = 'http://localhost:8080/api/admin/employees';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployees(page: number, size: number, position?: string, department?: string, active?: boolean): Observable<{ content: Employee[], totalElements: number }> {
    let params: any = { page, size };

    if (position) params.position = position;
    if (department) params.department = department;
    if (active !== null) params.active = active;

    return this.http.get<{ content: Employee[], totalElements: number }>(this.apiUrl, { params });
  }

  setEmployeeRole(employeeId: number, role: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${employeeId}/set-role`, { role });
  }


  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }


  registerEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  updateEmployee(updatedEmployee: Employee): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${updatedEmployee.id}`, updatedEmployee,
      { headers: this.getAuthHeaders() }, );
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  deactivateEmployee(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, { headers: this.getAuthHeaders() }, );
  }

}
