import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { TaxData, TaxService } from '../../services/tax.service';
import { SecuritiesTransaction } from '../../models/securities-transaction';

@Component({
  selector: 'app-tax-calculation',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './tax-calculation.component.html',
  standalone: true,
  styleUrl: './tax-calculation.component.css'
})
export class TaxCalculationComponent implements OnInit {

  private alertService = inject(AlertService);
  private taxService = inject(TaxService);

  securitiesTransactions: SecuritiesTransaction[] = [];
  filteredTransactions: SecuritiesTransaction[] = [];
  unpaidTaxes: SecuritiesTransaction[] = [];
  role: string = '';
  filterName: string = '';
  filterLastname: string = '';
  taxValue: number = 0;
  currentDate: Date = new Date();
  userTax: TaxData[] = [];
  filteredTax: TaxData[] = [];

  ngOnInit(): void {
    this.taxService.getTaxData().subscribe(
      (taxData) => {
        this.userTax = taxData;
      },
      (error) => {
        this.alertService.showAlert('error', 'Failed to fetch tax data. Please try again later.');
      }
    );

    this.filteredTransactions = this.securitiesTransactions;
    this.unpaidTaxes = this.securitiesTransactions.filter(transaction =>
      transaction.paidFlag.includes("No")
    );
    this.calculateTotalTax();
  }

  filterTransactions(): void {
    this.filteredTransactions = this.securitiesTransactions.filter(transaction =>
      transaction.name.toLowerCase().includes(this.filterName.toLowerCase()) &&
      transaction.role.toLowerCase().includes(this.role.toLowerCase()) &&
      transaction.lastname.toLowerCase().includes(this.filterLastname.toLowerCase())
    );
    this.unpaidTaxes = this.filteredTransactions.filter(transaction =>
      transaction.paidFlag.includes("No")
    );
    this.calculateTotalTax();
  }

  calculateTotalTax(): void {
    this.taxValue = this.unpaidTaxes.reduce((acc, transaction) => acc + transaction.tax, 0);
  }

  calculateTax(): void {
    this.taxService.calculateTax().subscribe({
      next: () => {
        this.alertService.showAlert('success', 'Tax calculation executed successfully.');
      },
      error: () => {
        this.alertService.showAlert('error', 'An error occurred during tax calculation. Please try again later.');
      },
    });
  }
}


