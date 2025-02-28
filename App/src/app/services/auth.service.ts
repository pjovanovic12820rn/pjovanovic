import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import {Message} from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth/login/';

  constructor(private http: HttpClient) {}

  login(email: string, password: string, userType: 'client' | 'employee'): Observable<{ token: string }> {
    const apiUrl = `${this.baseUrl}${userType}`;
    return this.http.post<{ token: string }>(apiUrl, { email, password });
  }

  logout(): void {
    sessionStorage.removeItem('jwt');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt');
  }

  getUserPermissions(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.permissions || null;
    } catch (error) {
      console.error('Invalid JWT Token');
      return null;
    }
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.userId || null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    return <boolean>this.getUserPermissions()?.includes('admin');
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/request-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

}
