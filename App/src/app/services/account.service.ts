import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Account } from '../models/account.model';
import { NewBankAccount } from '../models/new-bank-account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8082/api/account';

  // constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createForeignAccount(accountData: Account): Observable<any> {
    return this.http.post(this.apiUrl, accountData, { headers: this.getAuthHeaders() });
  }

  createCurrentAccount(newAccount: NewBankAccount): Observable<void> {
    return this.http.post<void>(this.apiUrl, newAccount, {
      headers: this.getAuthHeaders(),
    });
  }
}
