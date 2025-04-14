import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { TaxData, TaxService } from '../../services/tax.service';
import { SecuritiesTransaction } from '../../models/securities-transaction';

@Component({
  selector: 'app-tax-calculation',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './tax-calculation.component.html',
  standalone: true,
  styleUrl: './tax-calculation.component.css'
})
export class TaxCalculationComponent implements OnInit {

  private alertService = inject(AlertService);
  private taxService = inject(TaxService);


  role: string = '';
  filterName: string = '';
  filterLastname: string = '';
  taxValue: number = 0;
  currentDate: Date = new Date();
  userTax: TaxData[] = [];
  filteredUserTax: TaxData[] = [];
  loading: boolean = false;
  unpaidTax: number = 0;
  paidTax: number = 0;

  ngOnInit(): void {
    this.loading = true;
    this.taxService.getTaxData().subscribe({
      next: (taxData) => {
        this.userTax = taxData;
        this.filteredUserTax = [...this.userTax];
        this.loading = false;
        this.calculateTotalTax();
      },
      error: (err) => {
        console.error("Error fetching tax data:", err);
        this.alertService.showAlert('error', 'Failed to fetch tax data. Please try again later.');
        this.loading = false;
      }
    });
  }

  filterTransactions(): void {
    this.filteredUserTax = this.userTax.filter(transaction =>
      transaction.firstName.toLowerCase().includes(this.filterName.toLowerCase()) &&
      transaction.role.toLowerCase().includes(this.role.toLowerCase()) &&
      transaction.lastName.toLowerCase().includes(this.filterLastname.toLowerCase())
    );
    // this.unpaidTaxes = this.filteredTransactions.filter(transaction =>
    //   transaction.paidFlag.includes("No")
    // );
    this.calculateTotalTax();
  }

  calculateTotalTax(): void {
    this.unpaidTax = this.filteredUserTax.reduce((acc, tax) => {
      return acc + (tax.unpaidTaxThisMonth || 0); // Add unpaidTaxThisMonth if it exists, otherwise add 0
    }, 0);
  
    this.paidTax = this.filteredUserTax.reduce((acc, tax) => {
      return acc + (tax.paidTaxThisYear || 0); // Add paidTaxThisYear if it exists, otherwise add 0
    }, 0);
  }

  calculateTax(): void {
    console.log("Calculating tax...");
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


