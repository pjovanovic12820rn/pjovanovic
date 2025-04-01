import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Loan } from '../models/loan-dto.model';
import { Installment } from '../models/installment-model';

@Injectable({
  providedIn: 'root',
})
export class LoanService {
  private apiUrl = 'http://localhost:8082/api/loans';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Get all loans for a specific client
  getClientLoans(
    clientId: string | number
  ): Observable<{ content: Loan[]; totalElements: number }> {
    return this.http.get<{ content: Loan[]; totalElements: number }>(
      `${this.apiUrl}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get a specific loan by ID
  getLoan(loanId: number | undefined): Observable<any> {
    return this.http.get(`${this.apiUrl}/${loanId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getLoanInstallments(loanId: number | undefined): Observable<Installment[]> {
    return this.http.get<Installment[]>(`${this.apiUrl}/${loanId}/installments`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllLoans(): Observable<{ content: Loan[]; totalElements: number }> {
    return this.http.get<{ content: Loan[]; totalElements: number }>(
      `${this.apiUrl}/all`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get loan payment history
  getLoanPayments(loanId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${loanId}/payments`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Make a payment for a loan
  makePayment(loanId: string, paymentDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${loanId}/payments`, paymentDetails, {
      headers: this.getAuthHeaders(),
    });
  }

}
