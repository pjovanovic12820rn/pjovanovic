import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee, Message } from '../models/employee.model';
import { Observable, of, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login/employee';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password });
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

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.role || null;
      } catch (error) {
        console.error('Invalid JWT Token');
      }
    }
    return null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  resetPassword(token: string, newPassword: string): Observable<Message>{
    const message: Message = {
      message: "Password reset successfully"
    };
    return of(message);
  }

}
