import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from "rxjs";
import { MyPortfolio } from "../models/my-portfolio";
import { MyTax } from "../models/my-tax";
import { SetPublishModel } from '../models/set-publish-model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiURL = `${environment.stockUrl}/api/portfolio`;

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getPortfolio(): Observable<MyPortfolio[]>{
        return this.http.get<MyPortfolio[]>(this.apiURL,{headers: this.getAuthHeaders()})
    }


  // only stock could be set PUBLIC
  setPublicAmount(portfolioEntryId: number, publicAmount: number): Observable<any> {
    const body: SetPublishModel = {
      portfolioEntryId,
      publicAmount
    };

    return this.http.put<void>(
      `${this.apiURL}/public-amount`,
      body,
      { headers: this.getAuthHeaders() }
    );
  }

  getMyTaxes(): Observable<MyTax>{
        return this.http.get<MyTax>(`${this.apiURL}/tax`, { headers: this.getAuthHeaders() });
    }

}
