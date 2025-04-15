import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from "rxjs";
import {MyPortfolio, UseListing} from "../models/my-portfolio";
import { MyTax } from "../models/my-tax";
import { SetPublishModel } from '../models/set-publish-model';
import { environment } from '../environments/environment';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.stockUrl}/api/portfolio`;
    private apiUrlBank = `${environment.bankUrl}/api/profit`;
    private apiUrlStock = `${environment.stockUrl}/api/profit`;

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getPortfolio(): Observable<MyPortfolio[]>{
        return this.http.get<MyPortfolio[]>(this.apiUrl,{headers: this.getAuthHeaders()})
    }

    getBankProfit(): Observable<{ exchangeProfit: number }> {
      return this.http.get<{ exchangeProfit: number }>(
        `${this.apiUrlBank}`,
        { headers: this.getAuthHeaders() }
      );
    }
    getStockProfit(): Observable<{ stockCommissionProfit: number }> {
      return this.http.get<{ stockCommissionProfit: number }>(
        `${this.apiUrlStock}`,
        { headers: this.getAuthHeaders() }
      );
    }

    // only stock could be set PUBLIC
    setPublicAmount(portfolioEntryId: number, publicAmount: number): Observable<any> {
      const body: SetPublishModel = {
        portfolioEntryId,
        publicAmount
      };

      return this.http.put<void>(
        `${this.apiUrl}/public-amount`,
        body,
        { headers: this.getAuthHeaders() }
      );
    }

    getMyTaxes(): Observable<MyTax>{
        return this.http.get<MyTax>(`${this.apiUrl}/tax`, { headers: this.getAuthHeaders() });
    }

    // post use-option
    useListing(portfolioEntryId: number): Observable<any> {
      const useListing: UseListing = {
        portfolioEntryId,
      }
      return this.http.post<void>(`${this.apiUrl}/use-option`, useListing, { headers: this.getAuthHeaders() });
    }

}
