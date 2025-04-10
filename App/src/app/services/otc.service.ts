import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CreateOtcOfferDto } from '../models/create-otc-offer.dto';
import { OtcOfferDto } from '../models/otc-offer.dto';
import { PublicStockDto } from '../models/public-stock.dto';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OtcService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private otcBaseUrl = 'http://localhost:8083/api/otc';
  private portfolioBaseUrl = 'http://localhost:8083/api/portfolio';

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Authentication token is missing!');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getPublicStocks(): Observable<PublicStockDto[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.portfolioBaseUrl}/public-stocks`;

    return this.http.get<PublicStockDto[]>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createOtcOffer(offerData: CreateOtcOfferDto): Observable<OtcOfferDto> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    const url = this.otcBaseUrl;

    return this.http.post<OtcOfferDto>(url, offerData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message is: ${error.message}`;
      if (error.error && typeof error.error === 'string') {
         errorMessage += `\nDetails: ${error.error}`;
      } else if (error.error && error.error.message) {
         errorMessage += `\nDetails: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error('Something bad happened; please try again later. Details logged to console.'));
  }
}