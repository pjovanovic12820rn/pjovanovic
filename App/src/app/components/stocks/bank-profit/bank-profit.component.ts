import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActuariesService } from '../../../services/actuaries.service';
import { AuthService } from '../../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PortfolioService } from '../../../services/portfolio.service';

@Component({
  selector: 'app-bank-profit',
  templateUrl: './bank-profit.component.html',
  styleUrls: ['./bank-profit.component.css'],
  imports: [NgIf, NgForOf, PaginationComponent, DecimalPipe],
  standalone: true,
})
export class BankProfitComponent implements OnInit, OnDestroy {
  userTaxes: UserTaxInfo[] = [];
  filteredUserTaxes: UserTaxInfo[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  pageSize: number = 10;
  private destroy$ = new Subject<void>();
  currentPage: number = 1;

  exchangeProfit: number = 0;
  stockProfit: number = 0;

  constructor(
    private actuariesService: ActuariesService,
    private portfolioService: PortfolioService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isSupervisor() && !this.authService.isAdmin()) {
      this.errorMessage =
        'Access denied. Only supervisors and admins can access this portal.';
      return;
    }
    this.loadBankProfit();
    this.loadProfitSummaries();
  }

  loadBankProfit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.actuariesService.getBankProfit().subscribe({
        next: (profit) => {
            this.userTaxes = profit.content;
            this.filteredUserTaxes = [...this.userTaxes];
            this.loading = false;
        },
        error: (err) => {
            console.error("Error loading bank profit:", err);
            this.errorMessage = 'Failed to load bank profit. Please try again later.';
            this.loading = false;
        }
    });
}

  loadProfitSummaries(): void {
    this.portfolioService.getBankProfit().subscribe({
      next: (res) => {
        this.exchangeProfit = res.exchangeProfit ?? 0;
      },
      error: (err) => console.error('Bank profit fetch failed', err)
    });

    this.portfolioService.getStockProfit().subscribe({
      next: (res) => {
        this.stockProfit = res.stockCommissionProfit ?? 0;
      },
      error: (err) => console.error('Stock profit fetch failed', err)
    });
  }

updatePagedUserTaxes(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  this.userTaxes = this.filteredUserTaxes.slice(startIndex, startIndex + this.pageSize);
}

onPageChanged(page: number): void {
  this.currentPage = page;
  this.updatePagedUserTaxes();
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface UserTaxInfo {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  profit: number;
}
