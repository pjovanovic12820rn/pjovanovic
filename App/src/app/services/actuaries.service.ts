import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActuaryAgentDto } from '../models/actuary-agent.dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ActuariesService {
  private baseUrl = 'http://localhost:8080/api/admin/actuaries';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getActuariesAgents(): Observable<ActuaryAgentDto[]> {
    return this.http.get<ActuaryAgentDto[]>(`${this.baseUrl}/agents`, {
      headers: this.getAuthHeaders(),
    });
  }

  getBankProfit(): Observable<UserTaxInfo[]> {
    return this.http.get<UserTaxInfo[]>(`${this.baseUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }
}

interface UserTaxInfo {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  profit: number;
}
