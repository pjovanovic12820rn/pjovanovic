import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated()); // Tracks authentication status

  authStatus$ = this.authStatusSubject.asObservable(); // Observable for components to subscribe

  constructor(private http: HttpClient) {}

  login(email: string, password: string, loginType: 'employee' | 'client'): Observable<{ token: string }> {
    const apiUrl = `${this.baseUrl}/login/${loginType}`;
    return new Observable(observer => {
      this.http.post<{ token: string }>(apiUrl, { email, password }).subscribe({
        next: (response) => {
          this.saveToken(response.token);
          this.authStatusSubject.next(true); // 🔹 Notify subscribers that the user is logged in
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // login(email: string, password: string, loginType: 'employee' | 'client'): Observable<{ token: string }> {
  //   const apiUrl = `${this.baseUrl}/login/${loginType}`;
  //   return this.http.post<{ token: string }>(apiUrl, { email, password });
  // }

  logout(): void {
    sessionStorage.removeItem('jwt');
    this.authStatusSubject.next(false); // 🔹 Notify subscribers that the user is logged out
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('jwt');
  }

  saveToken(token: string): void {
    sessionStorage.setItem('jwt', token);
    this.authStatusSubject.next(true); // 🔹 Emit auth change when token is saved

  }

  getToken(): string | null {
    return sessionStorage.getItem('jwt');
  }

  getUserPermissions(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      return decoded.permissions || [];
    } catch (error) {
      console.error('Invalid JWT Token');
      return [];
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
    return this.getUserPermissions().includes('admin');
  }

  isEmployee(): boolean {
    return this.getUserPermissions().includes('employee');
  }

  isClient(): boolean {
    return this.getUserPermissions().includes('client');
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/request-password-reset`, { email });
  }

  resetPassword(token: string | null, password: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/set-password`, { token, password });
  }
}
