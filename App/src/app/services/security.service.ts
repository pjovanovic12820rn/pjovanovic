import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Security } from '../models/security.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ListingDetailsDto } from '../models/listing-details.dto';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private apiUrl = 'http://localhost:8083/api/listings';
  private authService = inject(AuthService);

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.error("Authentication token is missing.");
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSecurities(securityType: string = 'All'): Observable<Security[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(listings => listings.map(listing => this.mapListingToSecurity(listing))),
      map(securities => {
        if (securityType === 'All') {
          return securities;
        } else {
          return securities.filter(security => security.type === securityType);
        }
      })
    );
  }

  getSecurityById(id: number): Observable<Security | undefined> {
    return this.getSecurities().pipe(
      map(securities => securities.find(security => security.id === id))
    );
  }

  getListingDetails(id: number): Observable<ListingDetailsDto> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ListingDetailsDto>(url, { headers });
  }

  private mapListingToSecurity(listing: any): Security {
    let securityType: 'Stock' | 'Future' | 'Forex';
    switch (listing.listingType) {
      case 'STOCK':
        securityType = 'Stock';
        break;
      case 'FUTURES':
        securityType = 'Future';
        break;
      case 'FOREX':
        securityType = 'Forex';
        break;
      default:
        console.warn(`Unknown listing type encountered: ${listing.listingType}`);
        securityType = 'Stock';
    }

    return {
      id: listing.id,
      ticker: listing.ticker,
      price: listing.price ?? listing.currentPrice ?? 0,
      change: listing.change ?? 0,
      volume: listing.volume ?? 0,
      initialMarginCost: listing.initialMarginCost ?? 0,
      maintenanceMargin: listing.initialMarginCost ? listing.initialMarginCost / 1.1 : 0,
      type: securityType,
      settlementDate: listing.settlementDate
    };
  }
}