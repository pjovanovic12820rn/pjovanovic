import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/admin/clients';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`, // 🔐 Attach JWT Token
      'Content-Type': 'application/json',
    });
  }

  getAllUsers(page: number, size: number): Observable<{ content: User[], totalElements: number }> {
    let params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<{ content: User[], totalElements: number }>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  registerUser(user: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, user, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }
}
