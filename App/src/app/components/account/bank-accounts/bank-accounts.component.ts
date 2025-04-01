import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../services/account.service';
import { FormsModule } from '@angular/forms';
import { AccountResponse } from '../../../models/account-response.model';

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.css']
})
export class BankAccountsComponent implements OnInit {
  accounts: AccountResponse[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalItems: number = 0;
  loading: boolean = false;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getBankAccounts(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.accounts = res.content;
        this.totalItems = res.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bank accounts:', err);
        this.accounts = [];
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadAccounts();
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }
}
