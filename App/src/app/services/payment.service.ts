import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentOverviewDto } from '../models/payment-overview-dto';
import { PaymentDetailsDto } from '../models/payment-details-dto';
import { CreatePaymentDto } from '../models/create-payment-dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:8082/api/payment';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTransactionsOLD(cardNumber?: string): Observable<PaymentOverviewDto[]> {
    let url = this.baseUrl;
    if (cardNumber) {
      url += `?cardNumber=${cardNumber}`;
    }
    return this.http.get<PaymentOverviewDto[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  //moje
  getTransactions(
    page: number,
    size: number,
    startDate?: string,
    endDate?: string,
    minAmount?: number,
    maxAmount?: number,
    paymentStatus?: string,
    accountNumber?: string,
    cardNumber?: string
  ): Observable<{ content: PaymentOverviewDto[], totalElements: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (minAmount) params = params.set('minAmount', minAmount.toString());
    if (maxAmount) params = params.set('maxAmount', maxAmount.toString());
    if (paymentStatus) params = params.set('paymentStatus', paymentStatus);
    if (accountNumber) params = params.set('accountNumber', accountNumber);
    if (cardNumber) params = params.set('cardNumber', cardNumber);

    return this.http.get<{ content: PaymentOverviewDto[], totalElements: number }>(this.baseUrl, {
      headers: this.getAuthHeaders(), //.set('Accept', '*/*')
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  getTransactionDetails(id: number): Observable<PaymentDetailsDto> {
    return this.http.get<PaymentDetailsDto>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createPayment(dto: CreatePaymentDto): Observable<string> {  //bio je id originalno, ali nono (new trans trazi to)
    return this.http.post(this.baseUrl, dto, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(this.handleError)
    );
  }

  confirmPayment(paymentId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/confirm-payment/${paymentId}`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Something went wrong :(';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
