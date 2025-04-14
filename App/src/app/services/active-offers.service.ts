import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ActiveOfferDto } from '../models/active-offer.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveOffersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private baseUrl = '/api/offers';

  getActiveOffers(): Observable<ActiveOfferDto[]> {
    return this.http.get<ActiveOfferDto[]>(`${this.baseUrl}/active`);
  }

  acceptOffer(offerId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${offerId}/accept`, {});
  }

  declineOffer(offerId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${offerId}/decline`, {});
  }

  sendCounterOffer(offerId: number, payload: Partial<ActiveOfferDto>): Observable<any> {
    return this.http.post(`${this.baseUrl}/${offerId}/counter`, payload);
  }
}
