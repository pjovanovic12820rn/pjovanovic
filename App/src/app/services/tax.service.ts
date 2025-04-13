import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {environment} from '../environments/environment';

export interface TaxData {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  paidTaxThisYear: number;
  unpaidTaxThisMonth: number;
  totalTax: number;
}

@Injectable({
  providedIn: 'root',
})
export class TaxService {
  private baseUrl = `${environment.stockUrl}/api/tax`;
  private authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  constructor(private http: HttpClient) {}

  getTaxData(
    name: string = '',
    surname: string = '',
    role: string = ''
  ): Observable<TaxData[]> {
    const params = new HttpParams()
      .set('name', name)
      .set('surname', surname)
      .set('role', role);
    const headers = this.getAuthHeaders();

    return this.http.get<TaxData[]>(`${this.baseUrl}`, { headers, params });
  }

  calculateTax(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/process`, {}, {
      headers,
    });
  }
}
