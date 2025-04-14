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
    return this.http.get<ActiveOfferDto[]>(`${this.baseUrl}/received`, { headers: this.getAuthHeaders()});
  }

  acceptOffer(offerId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${offerId}/accept`, {}, { headers: this.getAuthHeaders()});
  }

  declineOffer(offerId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${offerId}/reject`, {}, { headers: this.getAuthHeaders()});
  }

  cancelOffer(offerId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${offerId}/cancel`, {}, { headers: this.getAuthHeaders()});
  }

  sendCounterOffer(offerId: number, payload: Partial<ActiveOfferDto>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${offerId}/counter`, payload, { headers: this.getAuthHeaders()});
  }
}
