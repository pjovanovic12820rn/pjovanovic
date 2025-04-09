import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActuaryService {

  private baseUrl = 'http://localhost:8080/api/admin/actuaries';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAgents(
    email: string,
    firstName: string,
    lastName: string,
    position: string,
    page: number,
    size: number
  ): Observable<any> {
    let params = new HttpParams();

    if (email) {
      params = params.set('email', email);
    }
    if (firstName) {
      params = params.set('firstName', firstName);
    }
    if (lastName) {
      params = params.set('lastName', lastName);
    }
    if (position) {
      params = params.set('position', position);
    }

    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<any>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params
    });
  }


  updateAgentLimit(agentId: number, newLimit: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/change-limit/${agentId}`,
      { newLimit },
      { headers: this.getAuthHeaders() }
    );
  }

  resetUsedLimit(agentId: number): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/reset-limit/${agentId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  setApprovalValue(agentId: number, needApproval: boolean): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/set-approval/${agentId}`,
      { needApproval },
      { headers: this.getAuthHeaders() }
    );
  }

  getAgentLimit(agentId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/${agentId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}
