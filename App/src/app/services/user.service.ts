import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = '/api/admin/users';
  private employeeUrl = '/api/admin/employees';

  constructor(private http: HttpClient) {}

  // Dohvati sve korisnike (samo admin)
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // Dohvati jednog korisnika
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  // Dohvati sve zaposlene (samo admin)
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl);
  }

  // Dohvati jednog zaposlenog
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.employeeUrl}/${id}`);
  }
}
