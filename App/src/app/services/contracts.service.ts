import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SettledContractDto } from '../models/settled-contract-dto';

import { AuthService } from './auth.service';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private apiUrl = `${environment.stockUrl}/api/otc`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSettledContracts(): Observable<SettledContractDto[]> {
    return this.http.get<SettledContractDto[]>(`${this.apiUrl}/options`, { headers: this.getAuthHeaders() });
  }

  exerciseContract(contractId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${contractId}/exercise`, {},
      {
        headers: this.getAuthHeaders()
      });
  }
}
