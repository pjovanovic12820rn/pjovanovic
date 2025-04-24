import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { AccountResponse } from '../../../models/account-response.model';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ButtonComponent } from '../../shared/button/button.component';

export interface ChangeAccountNameDto {
  newName: string;
}

export interface ChangeAccountLimitDto {
  newLimit: number;
}

@Component({
  selector: 'app-account-management',
  imports: [CommonModule, FormsModule, ModalComponent, RouterLink, ButtonComponent],
  standalone: true,
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
  accounts: AccountResponse[] = [];
  filteredAccounts: AccountResponse[] = [];
  selectedAccountNumber: string | undefined;
  clientId: string | null = null;
  pageSize: number = 10;

  isNameModalOpen: boolean = false;
  isLimitModalOpen: boolean = false;
  newName: string = '';
  newAccountLimit: number = 0;
  editingAccountNumber: string | null = null;
  isAccountModalOpen: boolean = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.queryParamMap.get('id');
    console.log(this.clientId)
    if (this.clientId) {
      this.fetchAccountsForEmployee(this.clientId);
    } else if ((this.isEmployee() || this.isAdmin()) && !this.clientId) {
      this.router.navigate(['/client-portal']);
    } else if (this.isClient()) {
      this.fetchAccountsForClient();
    } else {
      this.alertService.showAlert('error', 'Invalid access. Redirecting...');
      this.router.navigate(['/client-portal']);
    }
  }

  fetchAccountsForClient(): void {
    this.accountService.getMyAccountsRegular().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.filteredAccounts = accounts;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load your accounts.');
      },
    });
  }

  fetchAccountsForEmployee(clientId: string): void {
    this.accountService.getAccountsForClient(clientId, 0, 100).subscribe({
      next: (response) => {
        this.accounts = response.content;
        this.filteredAccounts = response.content;
      },
      error: () => {
        this.alertService.showAlert('error', 'Invalid client ID. Redirecting.');
        this.router.navigate(['/client-portal']);
      },
    });
  }

  isEmployee() {
    return this.authService.isEmployee();
  }
  isClient() {
    return this.authService.isClient();
  }
  isAdmin() {
    return this.authService.isAdmin();
  }

  viewCards(accountNumber: string): void {
    this.selectedAccountNumber = accountNumber;
    this.router.navigate([`/account/${accountNumber}`]);
  }

  openAccountModal() {
    this.isAccountModalOpen = true;
  }

  closeAccountModal() {
    this.isAccountModalOpen = false;
  }

  openNameModal(accountNumber: string, currentName: string) {
    this.editingAccountNumber = accountNumber;
    this.newName = currentName;
    this.isNameModalOpen = true;
  }

  closeNameModal() {
    this.isNameModalOpen = false;
    this.editingAccountNumber = null;
  }

  openLimitModal(accountNumber: string, currentLimit: number) {
    this.editingAccountNumber = accountNumber;
    this.newAccountLimit = currentLimit;
    this.isLimitModalOpen = true;
  }

  closeLimitModal() {
    this.isLimitModalOpen = false;
    this.editingAccountNumber = null;
  }

  changeAccountName() {
    if (!this.editingAccountNumber || !this.newName.trim()) return;

    this.accountService
      .changeAccountName(this.editingAccountNumber, this.newName.trim())
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Account name updated successfully.');
          this.closeNameModal();
          this.refreshAccounts();
        },
        error: () => {
          this.alertService.showAlert('error', 'Failed to update account name.');
        },
      });
  }

  changeAccountLimit() {
    if (!this.editingAccountNumber || this.newAccountLimit <= 0) return;

    this.accountService
      .changeAccountLimit(this.editingAccountNumber, this.newAccountLimit)
      .subscribe({
        next: () => {
          this.alertService.showAlert('success', 'Account limit change requested.');
          this.closeLimitModal();
          this.refreshAccounts();
        },
        error: () => {
          this.alertService.showAlert('error', 'Failed to request account limit change.');
        },
      });
  }

  refreshAccounts() {
    if (this.isClient()) {
      this.fetchAccountsForClient();
    } else if (this.clientId) {
      this.fetchAccountsForEmployee(this.clientId);
    }
  }
}
