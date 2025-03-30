import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AlertService} from '../../services/alert.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf, CurrencyPipe} from '@angular/common';
import {PortfolioService} from '../../services/portfolio.service';
import {Securities} from '../../models/securities';
import {ButtonComponent} from '../shared/button/button.component';
import {ModalComponent} from '../shared/modal/modal.component';
import { of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { OrderCreationModalComponent } from '../shared/order-creation-modal/order-creation-modal.component'; // Import the modal component

interface TaxSummary {
  taxPaidThisYear: number;
  unpaidTaxThisMonth: number;
}

@Component({
  selector: 'app-my-portfolio',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgClass,
    CurrencyPipe,
    ButtonComponent,
    ModalComponent,
    OrderCreationModalComponent
  ],
  templateUrl: './my-portfolio.component.html',
  styleUrl: './my-portfolio.component.css'
})
export class MyPortfolioComponent implements OnInit {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private portfolioService = inject(PortfolioService);

  securities: Securities[] = [];
  isProfitModalOpen = false;
  isTaxModalOpen = false;
  today: Date = new Date();

  taxPaidThisYear: number | null = null;
  unpaidTaxThisMonth: number | null = null;
  loadingTaxData: boolean = false;
  taxDataError: string | null = null;

  isOrderModalOpen = false;
  selectedSecurityForOrder: Securities | null = null;
  orderDirection: 'BUY' | 'SELL' = 'BUY';

  ngOnInit(): void {
    this.securities = this.portfolioService.getMySecurities();
    this.today.setHours(0, 0, 0, 0);
    this.loadTaxData();
  }

  loadTaxData(): void {
    this.loadingTaxData = true;
    this.taxDataError = null;
    this.taxPaidThisYear = null;
    this.unpaidTaxThisMonth = null;

    const mockTaxSummary: TaxSummary = {
      taxPaidThisYear: this.getTotalProfit() * 0.15,
      unpaidTaxThisMonth: 67.89
    };
    of(mockTaxSummary).pipe(
      delay(2000),
      finalize(() => this.loadingTaxData = false)
    ).subscribe({
      next: (summary) => {
        this.taxPaidThisYear = summary.taxPaidThisYear;
        this.unpaidTaxThisMonth = summary.unpaidTaxThisMonth;
      },
      error: (err) => {
        console.error("Error loading tax data:", err);
        this.taxDataError = "Failed to load tax information. Please try again later.";
      }
    });
  }


  isActuary(): boolean {
    return this.authService.isActuary();
  }

  canExerciseOption(security: Securities): boolean {
    if (!this.isActuary() || security.type !== 'Option' || !security.settlementDate || !security.strikePrice || !security.underlyingStockPrice || !security.optionType) {
      return false;
    }

    const settlementDate = new Date(security.settlementDate);
    settlementDate.setHours(0, 0, 0, 0);

    if (settlementDate < this.today) {
      return false;
    }

    if (security.optionType === 'Call') {
      return security.underlyingStockPrice > security.strikePrice;
    } else if (security.optionType === 'Put') {
      return security.underlyingStockPrice < security.strikePrice;
    }

    return false;
  }

  exerciseOption(security: Securities): void {
    console.log(`Attempting to exercise ${security.optionType} option for ${security.ticker} with strike ${security.strikePrice}`);
    this.alertService.showAlert('info', `Exercise action triggered for ${security.ticker}.`);
  }

  openSellOrderModal(security: Securities): void {
    if (security.amount <= 0) {
      this.alertService.showAlert('warning', `No amount available to sell for ${security.ticker}.`);
      return;
    }
    this.selectedSecurityForOrder = security;
    this.orderDirection = 'SELL';
    this.isOrderModalOpen = true;
  }

  closeOrderModal(): void {
    this.isOrderModalOpen = false;
    this.selectedSecurityForOrder = null;
  }

  handleOrderCreation(orderDetails: any): void {
    console.log('Order creation requested from MyPortfolioComponent:', orderDetails, 'for security:', this.selectedSecurityForOrder);
    this.closeOrderModal();
  }

  getTotalProfit(): number {
    return this.securities
      .filter(security => security.type === 'Stock')
      .reduce((sum, security) => sum + security.profit, 0);
  }

  openProfitModal(): void {
    this.isProfitModalOpen = true;
  }

  openTaxModal(): void {
    this.isTaxModalOpen = true;
  }

  closeModals(): void {
    this.isProfitModalOpen = false;
    this.isTaxModalOpen = false;
  }

  publishSecurity(security: Securities): void {
    security.publicCounter += 1;
  }

  get currentSecurityPrice(): number {
    return this.selectedSecurityForOrder?.price ?? 0;
  }

   get currentContractSize(): number {
     return 1;
  }
  
  get currentListingId(): number | null {
    return this.selectedSecurityForOrder?.id ?? null;
}


}