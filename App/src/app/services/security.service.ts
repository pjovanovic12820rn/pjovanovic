import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Security } from '../models/security.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() { }

  getSecurities(): Observable<Security[]> {
    const mockSecurities: Security[] = [
      {
        ticker: 'AAPL',
        price: 170.34,
        change: 1.5,
        volume: 1500000,
        maintenanceMargin: 10,
        initialMarginCost: 10 * 1.1,
        type: 'Stock'
      },
      {
        ticker: 'GOOGL',
        price: 2500.10,
        change: -5.2,
        volume: 800000,
        maintenanceMargin: 20,
        initialMarginCost: 20 * 1.1,
        type: 'Stock'
      },
      {
        ticker: 'TSLA',
        price: 850.50,
        change: 12.3,
        volume: 2000000,
        maintenanceMargin: 5,
        initialMarginCost: 5 * 1.1,
        type: 'Stock'
      },
      {
        ticker: 'EURUSD',
        price: 1.0850,
        change: 0.0015,
        volume: 5000000,
        maintenanceMargin: 0.05,
        initialMarginCost: 0.05 * 1.1,
        type: 'Forex'
      },
      {
        ticker: 'GBPUSD',
        price: 1.2500,
        change: -0.0020,
        volume: 4500000,
        maintenanceMargin: 0.06,
        initialMarginCost: 0.06 * 1.1,
        type: 'Forex'
      },
      {
        ticker: 'NQ=F',
        price: 18000.00,
        change: 150.00,
        volume: 100000,
        maintenanceMargin: 100,
        initialMarginCost: 100 * 1.1,
        type: 'Future',
        settlementDate: '2024-12-20'
      },
      {
        ticker: 'ES=F',
        price: 4500.00,
        change: -20.00,
        volume: 120000,
        maintenanceMargin: 50,
        initialMarginCost: 50 * 1.1,
        type: 'Future',
        settlementDate: '2025-03-15'
      },
      {
        ticker: 'USDJPY',
        price: 157.50,
        change: 0.10,
        volume: 6000000,
        maintenanceMargin: 0.07,
        initialMarginCost: 0.07 * 1.1,
        type: 'Forex'
      }
    ];
    const updatedMockSecurities = mockSecurities.map(security => ({
      ...security,
      price: security.price + (Math.random() * 2 - 1) * 0.5
    }));
    return of(updatedMockSecurities);
  }

  getSecurityByTicker(ticker: string): Observable<Security> {
    return this.getSecurities().pipe(
      (securitiesObservable: Observable<Security[]>) => {
        return new Observable<Security>(observer => {
          securitiesObservable.subscribe(securities => {
            const security = securities.find(s => s.ticker === ticker);
            if (security) {
              observer.next(security);
              observer.complete();
            } else {
              observer.error(`Security with ticker ${ticker} not found`);
            }
          }, error => observer.error(error));
        });
      }
    );
  }
}