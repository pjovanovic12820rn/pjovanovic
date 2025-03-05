import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { AuthService } from './auth.service';
import { Account } from '../models/account.model';
import { NewBankAccount } from '../models/new-bank-account.model';
import {AccountDetails} from '../models/account-details';
import {Transactions } from '../models/transactions';
import {AccountTransfer} from '../models/account-transfer';
import {Employee} from '../models/employee.model';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8082/api/account';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // getAllAccounts(): Observable<AccountDetails[]> {
  //   return this.http.get<AccountDetails[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  // }

  getTransactions(accountNo: string): Observable<Transactions> {
    return this.http.get<Transactions>(`${this.apiUrl}/transactions/${accountNo}`, { headers: this.getAuthHeaders() });
  }

  getMyAccounts(){
    return this.http.get<{ content: AccountTransfer[]}>(this.apiUrl, { headers: this.getAuthHeaders()});
  }

  createForeignAccount(accountData: Account): Observable<any> {
    return this.http.post(this.apiUrl, accountData, { headers: this.getAuthHeaders() });
  }

  createCurrentAccount(newAccount: NewBankAccount): Observable<void> {
    return this.http.post<void>(this.apiUrl, newAccount, {
      headers: this.getAuthHeaders(),
    });
  }

  getAccountDetails(accountNo: string): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(`${this.apiUrl}/${accountNo}`, {headers: this.getAuthHeaders()});

  }

}
