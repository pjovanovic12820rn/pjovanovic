import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/admin/clients';

  constructor(private authService: AuthService, private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user, { headers: this.getAuthHeaders() });
  }

  getAllUsers(page: number, size: number): Observable<{ content: User[], totalElements: number }> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<{ content: User[], totalElements: number }>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  getUserById(id: number): Observable<User> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: number): Observable<void> {
    if (!this.authService.isAdmin) {
      return throwError(() => new Error('Permission denied: Admin access required.'));
    }
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }
}
