import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Securities} from '../models/securities';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiURL = "http://localhost:80.....";


  securitiesList: Securities[] = [
    {
      type: "Stock",
      ticker: "AAPL",
      amount: 50,
      price: 175.25,
      profit: 1200.50,
      lastModified: "2025-03-18",
      publicCounter: 5
    },
    {
      type: "Stock",
      ticker: "TSLA",
      amount: 20,
      price: 220.75,
      profit: -300.00,
      lastModified: "2025-03-17",
      publicCounter: 8
    },
    {
      type: "ETF",
      ticker: "SPY",
      amount: 100,
      price: 450.10,
      profit: 2500.00,
      lastModified: "2025-03-16",
      publicCounter: 0
    },
    {
      type: "Crypto",
      ticker: "BTC",
      amount: 2,
      price: 68000.00,
      profit: 15000.75,
      lastModified: "2025-03-15",
      publicCounter: 20
    },
    {
      type: "Bond",
      ticker: "US10Y",
      amount: 30,
      price: 98.50,
      profit: 120.30,
      lastModified: "2025-03-14",
      publicCounter: 0
    }
  ];


  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMySecurities(){
    return this.securitiesList;
  }

  makeStockPublic(){

  }



}
