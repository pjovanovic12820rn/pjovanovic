import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Option, OptionType } from '../models/option.model';
import { Stock } from '../models/option.model';
import { Exchange } from '../models/option.model';
import { OptionChain, OptionPair } from '../models/option.model';

@Injectable({
  providedIn: 'root'
})
export class OptionService {
  
  constructor() {}

  getOptionsByStock(stockId: number): Observable<Option[]> {
    return of(this.generateMockOptions(stockId));
  }

  getOptionChainsByStock(stockId: number): Observable<OptionChain[]> {
    const options = this.generateMockOptions(stockId);
    
    // Group options by expiration date
    const optionsByDate = options.reduce((groups, option) => {
      const dateKey = option.settlementDate.toISOString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(option);
      return groups;
    }, {} as Record<string, Option[]>);
    
    // Create option chains
    const optionChains: OptionChain[] = Object.keys(optionsByDate).map(dateKey => {
      const expirationDate = new Date(dateKey);
      const today = new Date();
      const daysToExpiry = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      const optionsForDate = optionsByDate[dateKey];
      const stockPrice = optionsForDate[0].underlyingStock.price;
      
      // Group by strike price to create pairs
      const optionsByStrike = optionsForDate.reduce((strikes, option) => {
        const strikeKey = option.strikePrice.toString();
        if (!strikes[strikeKey]) {
          strikes[strikeKey] = { call: null, put: null, strikePrice: option.strikePrice };
        }
        if (option.optionType === OptionType.CALL) {
          strikes[strikeKey].call = option;
        } else {
          strikes[strikeKey].put = option;
        }
        return strikes;
      }, {} as Record<string, OptionPair>);
      
      // Convert to array and sort by strike price
      const optionPairs = Object.values(optionsByStrike)
        .sort((a, b) => a.strikePrice - b.strikePrice);
      
      return {
        expirationDate,
        daysToExpiry,
        stockPrice,
        optionPairs
      };
    });
    
    // Sort by closest expiration date
    return of(optionChains.sort((a, b) => a.daysToExpiry - b.daysToExpiry));
  }

  private generateMockOptions(stockId: number): Option[] {
    const options: Option[] = [];
    const today = new Date();
    
    // Mock exchange
    const exchange: Exchange = {
      mic: 'XNYS',
      name: 'New York Stock Exchange',
      acronym: 'NYSE',
      polity: 'United States',
      currencyCode: 'USD',
      timeZone: -5
    };
    
    // Mock stock
    const stock: Stock = {
      id: stockId,
      ticker: 'AAPL',
      name: 'Apple Inc.',
      exchange: exchange,
      lastRefresh: new Date(),
      price: 160.32,
      ask: 160.35,
      outstandingShares: 16000000000,
      dividendYield: 0.58
    };
    
    // Create expiration dates
    const expirationDates = [
      new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
    ];
    
    // Create strikes around current price
    const strikes = [140, 150, 160, 170, 180];
    
    let id = 1;
    
    // Generate options for each expiration and strike
    expirationDates.forEach(expDate => {
      strikes.forEach(strike => {
        // Call option
        options.push({
          id: id++,
          ticker: `AAPL${expDate.toISOString().split('T')[0].replace(/-/g, '')}C${strike}`,
          name: `AAPL ${strike} Call ${expDate.toLocaleDateString()}`,
          exchange: exchange,
          lastRefresh: new Date(),
          price: this.calculateOptionPrice(stock.price, strike, expDate, OptionType.CALL),
          ask: this.calculateOptionPrice(stock.price, strike, expDate, OptionType.CALL) + 0.05,
          optionType: OptionType.CALL,
          strikePrice: strike,
          impliedVolatility: 30 + Math.random() * 10,
          openInterest: Math.floor(Math.random() * 1000),
          settlementDate: expDate,
          underlyingStock: stock
        });
        
        // Put option
        options.push({
          id: id++,
          ticker: `AAPL${expDate.toISOString().split('T')[0].replace(/-/g, '')}P${strike}`,
          name: `AAPL ${strike} Put ${expDate.toLocaleDateString()}`,
          exchange: exchange,
          lastRefresh: new Date(),
          price: this.calculateOptionPrice(stock.price, strike, expDate, OptionType.PUT),
          ask: this.calculateOptionPrice(stock.price, strike, expDate, OptionType.PUT) + 0.05,
          optionType: OptionType.PUT,
          strikePrice: strike,
          impliedVolatility: 30 + Math.random() * 10,
          openInterest: Math.floor(Math.random() * 1000),
          settlementDate: expDate,
          underlyingStock: stock
        });
      });
    });
    
    return options;
  }
  
  private calculateOptionPrice(stockPrice: number, strikePrice: number, expDate: Date, type: OptionType): number {
    const today = new Date();
    const daysToExpiry = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const timeValue = daysToExpiry / 365 * stockPrice * 0.2;
    
    let intrinsicValue = 0;
    if (type === OptionType.CALL) {
      intrinsicValue = Math.max(0, stockPrice - strikePrice);
    } else {
      intrinsicValue = Math.max(0, strikePrice - stockPrice);
    }
    
    return parseFloat((intrinsicValue + timeValue).toFixed(2));
  }
}