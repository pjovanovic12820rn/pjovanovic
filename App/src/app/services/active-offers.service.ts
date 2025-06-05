import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { AuthService } from './auth.service';
import { ActiveOfferDto } from '../models/active-offer.dto';
import { Observable } from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActiveOffersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl = `${environment.stockUrl}/api/otc`;

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

  getActiveOffers(): Observable<ActiveOfferDto[]> {
    return this.http.get<ActiveOfferDto[]>(`${this.baseUrl}/received`, {
      headers: this.getAuthHeaders()
    });
  }

  acceptOffer(offerId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/${offerId}/accept`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });

  }

  declineOffer(offerId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/${offerId}/reject`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  cancelOffer(offerId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/${offerId}/cancel`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  // sendCounterOffer(offerId: number, payload: Partial<ActiveOfferDto>): Observable<string> {
  //   return this.http.put(`${this.baseUrl}/${offerId}/counter`, payload, {
  //     headers: this.getAuthHeaders(),
  //     responseType: 'text'
  //   });
  // }
  sendCounterOffer(offerId: number, payload: any): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/${offerId}/counter`,
      {
        portfolioEntryId: payload.portfolioEntryId,
        pricePerStock: payload.pricePerStock,
        settlementDate: payload.settlementDate,
        premium: payload.premium,
        amount: payload.amount
      },
      {
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }
    );
  }
}
