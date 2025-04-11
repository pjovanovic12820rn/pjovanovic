import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettledContractDto } from '../models/settled-contract-dto';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private apiUrl = 'http://localhost:8083/api/otc/options';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSettledContracts(): Observable<SettledContractDto[]> {
    return this.http.get<SettledContractDto[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  exerciseContract(contractId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${contractId}/exercise`, {}, { headers: this.getAuthHeaders() });
  }
}
