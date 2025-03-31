import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Securities} from '../models/securities';
import {SecuritiesTransaction} from '../models/securities-transaction';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiURL = "http://localhost:80.....";


  private securitiesList: Securities[] = [
    {
      id: 1,
      type: "Stock",
      ticker: "AAPL",
      amount: 50,
      price: 175.25,
      profit: 1200.50,
      lastModified: "2025-03-18",
      publicCounter: 5,
      underlyingStockPrice: 175.25
    },
    {
      id: 2,
      type: "Stock",
      ticker: "MSFT",
      amount: 30,
      price: 420.50,
      profit: -150.00,
      lastModified: "2025-03-20",
      publicCounter: 10,
      underlyingStockPrice: 420.50
    },
    {
      id: 3,
      type: "Future",
      ticker: "ESM25",
      amount: 2,
      price: 5100.75,
      profit: 850.25,
      lastModified: "2025-03-22",
      publicCounter: 1,
    },
    {
      id: 4,
      type: "Option",
      ticker: "AAPL",
      optionType: "Call",
      amount: 5, 
      price: 8.50, 
      profit: 250.00, 
      lastModified: "2025-03-25",
      publicCounter: 0,
      strikePrice: 170.00,
      settlementDate: new Date("2025-04-18"), 
      underlyingStockPrice: 175.25
    },
    {
      id: 5,
      type: "Option",
      ticker: "AAPL",
      optionType: "Put",
      amount: 3, 
      price: 2.10,
      profit: -50.00,
      lastModified: "2025-03-26",
      publicCounter: 0,
      strikePrice: 170.00,
      settlementDate: new Date("2025-04-18"), 
      underlyingStockPrice: 175.25
    },
    {
      id: 6,
      type: "Option",
      ticker: "MSFT",
      optionType: "Put",
      amount: 10, 
      price: 15.00,
      profit: 1100.00,
      lastModified: "2025-03-10",
      publicCounter: 0,
      strikePrice: 430.00,
      settlementDate: new Date("2025-04-25"), 
      underlyingStockPrice: 420.50 
    },
    {
      id: 7,
      type: "Option",
      ticker: "MSFT",
      optionType: "Call",
      amount: 2,
      price: 5.50,
      profit: 80.00,
      lastModified: "2025-02-28",
      publicCounter: 0,
      strikePrice: 410.00,
      settlementDate: new Date("2025-03-21"),
      underlyingStockPrice: 420.50
    },
    {
      id: 8,
      type: "ETF",
      ticker: "SPY",
      amount: 100,
      price: 515.10,
      profit: 2500.00,
      lastModified: "2025-03-16",
      publicCounter: 0,
      underlyingStockPrice: 515.10
    }
  ];



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


  getAllSecuritiesTransactions(){
    return this.securitiesTransactions;
  }

  makeStockPublic(){
    return null;
  }



}
