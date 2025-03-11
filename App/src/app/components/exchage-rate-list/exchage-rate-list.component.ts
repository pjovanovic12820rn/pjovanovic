import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { Exchange } from '../../models/exchange';
import { ExchangeService } from '../../services/exchange.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-exchage-rate-list',
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './exchage-rate-list.component.html',
  styleUrl: './exchage-rate-list.component.css'
})
export class ExchageRateListComponent {
  private exchangeService = inject(ExchangeService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  exchageRateList: Exchange[] = [];
  exchangeAmount: number = 0;
  fromCurrency: string = 'RSD';
  toCurrency: string = 'USD';
  convertedAmount: number = 0;
  currencies: string[] = [];

  ngOnInit() {
    this.exchangeService.getExchageRateList().subscribe({
      next: (response) => {
        this.exchageRateList = response;
        this.currencies = this.extractCurrencies(response);
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load exchange rate list. Please try again later.');
        this.exchageRateList = [];
      }
    });
  }

  private extractCurrencies(exchangeRates: Exchange[]): string[] {
    const currencySet = new Set<string>();
    exchangeRates.forEach(rate => {
      currencySet.add(rate.fromCurrency.code);
      currencySet.add(rate.toCurrency.code);
    });
    return Array.from(currencySet);
  }

  convertCurrency() {
    const rate = this.exchageRateList.find(
      r => r.fromCurrency.code === this.fromCurrency && r.toCurrency.code === this.toCurrency
    );

    if (rate) {
      this.convertedAmount = this.exchangeAmount * rate.exchangeRate;
    } else {
      this.convertedAmount = 0;
    }
  }

  exchangeRateCalculation() {
    this.exchangeService.getExchageFromToAmount(this.fromCurrency,this.toCurrency,this.exchangeAmount).subscribe({
      next: (response) => {
        this.convertedAmount = response;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to convert currency from exchange rate list. Please try again later.');
        this.convertedAmount = 0;
      }
    })
  }


}
