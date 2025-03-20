import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Exchange} from '../models/exchange';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = "http://localhost:8082/api/exchange-rates";

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getExchangeRateList(): Observable<Exchange[]> {
    return this.http.get<Exchange[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getExchangeFromToAmount(fromCurrencyCode: string, toCurrencyCode: string, amount: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/convert`,
      { fromCurrencyCode: fromCurrencyCode,  toCurrencyCode: toCurrencyCode , amount: amount},
      { headers: this.getAuthHeaders() }
    );
  }


}
