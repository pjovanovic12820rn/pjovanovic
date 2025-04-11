import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Securities} from '../models/securities';
import {SecuritiesTransaction} from '../models/securities-transaction';
import {Observable} from "rxjs";
import {MyPortfolio} from "../models/my-portfolio";
import {MyTax} from "../models/my-tax";
import {SetPublishModel} from '../models/set-publish-model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiURL = "http://localhost:8083/api/portfolio";



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





  securitiesTransactions: SecuritiesTransaction[] = [
    { clientId: 1, role: "Client" ,name: 'Milan', lastname: 'Kosanovic', accountNumber: 1234521, transaction: 123,transactionDate: "2025-03-21", securitiesType: 'BTC', paidPrice: 8000, soldPrice: 9600, profit: 1600, tax: 240, paidFlag: 'Yes', date: '2025-02-27' },
    { clientId: 2, role: "Employee" ,name: 'Zoran', lastname: 'Zokic', accountNumber: 5533321, transaction: 231, transactionDate: "2025-02-16",securitiesType: 'ADA', paidPrice: 450, soldPrice: 2000, profit: 1550, tax: 232.5, paidFlag: 'No', date: '-' },
    { clientId: 3, role: "Admin" ,name: 'Ivana', lastname: 'Petrovic', accountNumber: 9876543, transaction: 312, transactionDate: "2025-03-14",securitiesType: 'ETH', paidPrice: 3000, soldPrice: 3500, profit: 500, tax: 75, paidFlag: 'Yes', date: '2025-03-01' },
    { clientId: 4, role: "Admin" ,name: 'Nikola', lastname: 'Jovanovic', accountNumber: 1122334, transaction: 421,transactionDate: "2025-02-24", securitiesType: 'XRP', paidPrice: 1, soldPrice: 1.5, profit: 0.5, tax: 0.1, paidFlag: 'No', date: '-' },
    { clientId: 5, role: "Employee" ,name: 'Ana', lastname: 'Markovic', accountNumber: 6677889, transaction: 523, transactionDate: "2025-01-21",securitiesType: 'SOL', paidPrice: 150, soldPrice: 180, profit: 30, tax: 4.5, paidFlag: 'Yes', date: '2025-03-05' },
    { clientId: 6, role: "Actuator" ,name: 'Stefan', lastname: 'Milic', accountNumber: 9988776, transaction: 632, transactionDate: "2025-01-29",securitiesType: 'DOT', paidPrice: 10, soldPrice: 12, profit: 2, tax: 0.3, paidFlag: 'No', date: '-' },
    { clientId: 7, role: "Employee" ,name: 'Jelena', lastname: 'Nikolic', accountNumber: 3344556, transaction: 745,transactionDate: "2025-01-07", securitiesType: 'MATIC', paidPrice: 0.8, soldPrice: 1.2, profit: 0.4, tax: 0.06, paidFlag: 'Yes', date: '2025-03-10' },
    { clientId: 8,role: "Client" , name: 'Marko', lastname: 'Pavlovic', accountNumber: 2233445, transaction: 854,transactionDate: "2025-03-09", securitiesType: 'LTC', paidPrice: 90, soldPrice: 100, profit: 10, tax: 1.5, paidFlag: 'No', date: '-' },
    { clientId: 9, role: "Actuator" ,name: 'Sara', lastname: 'Vasic', accountNumber: 5566778, transaction: 963, transactionDate: "2025-03-12",securitiesType: 'ADA', paidPrice: 1.5, soldPrice: 2, profit: 0.5, tax: 0.08, paidFlag: 'Yes', date: '2025-03-15' },
    { clientId: 10,role: "Client" , name: 'Luka', lastname: 'Petrov', accountNumber: 7788991, transaction: 1021, transactionDate: "2025-03-13",securitiesType: 'BTC', paidPrice: 9000, soldPrice: 11000, profit: 2000, tax: 300, paidFlag: 'No', date: '-' },
    { clientId: 1, role: "Client" ,name: 'Milan', lastname: 'Kosanovic', accountNumber: 1234521, transaction: 5512,transactionDate: "2025-03-13", securitiesType: 'ETH', paidPrice: 130, soldPrice: 1000, profit: 870, tax: 125, paidFlag: 'Yes', date: '2025-03-15' },
    { clientId: 1, role: "Client" ,name: 'Milan', lastname: 'Kosanovic', accountNumber: 1234521, transaction: 23,transactionDate: "2025-03-24", securitiesType: 'SOL', paidPrice: 3400, soldPrice: 5000, profit: 1600, tax: 240, paidFlag: 'No', date: '-' },
    { clientId: 1, role: "Client" ,name: 'Milan', lastname: 'Kosanovic', accountNumber: 5566221, transaction: 1152,transactionDate: "2025-03-22", securitiesType: 'PEPE', paidPrice: 10000, soldPrice: 11000, profit: 1000, tax: 150, paidFlag: 'No', date: '-' }
    ,{ clientId: 1, role: "Client" ,name: 'Milan', lastname: 'Kosanovic', accountNumber: 5566221, transaction: 89,transactionDate: "2025-02-28", securitiesType: 'Apple Inc', paidPrice: 2550, soldPrice: 4550, profit: 2000, tax: 300, paidFlag: 'Yes', date: '2025-02-23' }
  ];


  getAllSecuritiesTransactions(){
    return this.securitiesTransactions;
  }




}
