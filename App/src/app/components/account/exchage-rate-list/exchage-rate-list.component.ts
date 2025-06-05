import { Component, inject , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { Exchange } from '../../../models/exchange';
import { ExchangeService } from '../../../services/exchange.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import {InputTextComponent} from '../../shared/input-text/input-text.component';
import {ButtonComponent} from '../../shared/button/button.component';
import {ModalComponent} from '../../shared/modal/modal.component';

@Component({
  selector: 'app-exchage-rate-list',
  imports: [FormsModule, NgForOf, NgIf, InputTextComponent, ButtonComponent, ModalComponent],
  templateUrl: './exchage-rate-list.component.html',
  standalone: true,
  styleUrl: './exchage-rate-list.component.css'
})
export class ExchageRateListComponent implements OnInit {
  private exchangeService = inject(ExchangeService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  exchageRateList: Exchange[] = [];
  exchangeAmount: number = 0;
  fromCurrency: string = 'RSD';
  toCurrency: string = 'EUR';
  convertedAmount: number = 0;
  currencies: string[] = [];

  availableToCurrencies: string[] = []

  ngOnInit() {
    this.exchangeService.getExchangeRateList().subscribe({
      next: (response) => {
        this.exchageRateList = response;
        this.currencies = this.extractCurrencies(response);
        this.updateAvailableToCurrencies();
        console.log(this.currencies)
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

  updateAvailableToCurrencies() {
    const allCurrencies = new Set<string>();

    this.exchageRateList.forEach(rate => {
      allCurrencies.add(rate.fromCurrency.code);
      allCurrencies.add(rate.toCurrency.code);
    });
  
    // Remove the current "from" currency from the target list
    allCurrencies.delete(this.fromCurrency);
  
    this.availableToCurrencies = Array.from(allCurrencies);
  }

  exchangeRateCalculation() {

    if(this.exchangeAmount == null){
      this.exchangeAmount = 0;
    }

    this.exchangeService.getExchangeFromToAmount(this.fromCurrency,this.toCurrency,this.exchangeAmount).subscribe({
      next: (response) => {
        this.convertedAmount = response;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to convert currency from exchange rate list. Please try again later.');
        this.convertedAmount = 0;
      }
    })
  }

  onFromCurrencyChange() {
    this.updateAvailableToCurrencies();
    if (this.fromCurrency == this.toCurrency) {
      this.toCurrency = this.availableToCurrencies.length ? this.availableToCurrencies[0] : '';
    }
    this.exchangeRateCalculation();
  }

  onToCurrencyChange() {
    this.exchangeRateCalculation();
   }
  // resetValues(){
  //   this.exchangeAmount = 0;
  //   this.fromCurrency = 'EUR';
  //   this.toCurrency = 'RSD';
  // }
  isCurrencyConversionModalOpen: boolean = false;
}
