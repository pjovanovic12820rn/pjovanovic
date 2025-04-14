import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActuaryAgentDto } from '../models/actuary-agent.dto';
import { AuthService } from './auth.service';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActuariesService {
  private baseUrl = `${environment.userUrl}/api/admin/actuaries`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getBankProfit(): Observable<UserTaxInfo[]> {
    return this.http.get<UserTaxInfo[]>(`${this.baseUrl}`, {
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
