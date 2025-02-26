import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Paginated } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/admin/clients'; // 🔹 Updated to match backend endpoint

  constructor(private authService: AuthService, private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // 🔐 Attach JWT
      'Content-Type': 'application/json',
    });
  }

  registerUser(userData: any): Observable<any> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Only admins can register users.'));
    }

    return this.http.post<any>(`${this.baseUrl}/register`, userData, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUsers(page: number = 0, size: number = 10): Observable<Paginated<User>> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }

    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Paginated<User>>(this.baseUrl, { headers: this.getAuthHeaders(), params });
  }

  getUserById(id: number): Observable<User> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(updatedUser: User): Observable<boolean> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.put<boolean>(`${this.baseUrl}/${updatedUser.id}`, updatedUser, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: number): Observable<boolean> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
