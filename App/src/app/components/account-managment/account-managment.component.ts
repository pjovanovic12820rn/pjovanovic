import { Component, inject, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { AccountResponse } from '../../models/account-response.model';

@Component({
  selector: 'app-account-managment',
  imports: [],
  standalone: true,
  templateUrl: './account-managment.component.html',
  styleUrl: './account-managment.component.css',
})
export class AccountManagmentComponent implements OnInit {

  ngOnInit(): void {
    this.loadAccounts();
  }
  
  private accountService = inject(AccountService);
  private alertService = inject(AlertService);
  accounts: AccountResponse[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalUsers: number = 0;

  // this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe({
  //   next: (data) => {
  //     this.users = data.content;
  //     this.totalUsers = data.totalElements;
  //   },
  //   error: () => {
  //     this.alertService.showAlert('error', 'Failed to load users. Please try again later.');
  //   },
  // });

  loadAccounts() {
    console.log('Loading accounts...');
    this.accountService.getAllAccounts(this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.accounts = data.content;
          this.totalUsers = data.totalElements;
        },
        error: () => {
          this.alertService.showAlert(
            'error',
            'Failed to create account. Please try again.'
          );
        },
      });
  }

  public account1 = {
    number: '123456789',
    type: 'Checking',
    owner: 1000,
    category: 'USD',
  };

  public account2 = {
    number: '123456789',
    type: 'Checking',
    owner: 1000,
    category: 'USD',
  };

  public card1 = {
    number: '123456789',
    status: 'Active',
    owner: 1000,
  };

  public card2 = {
    number: '123456789',
    status: 'Active',
    owner: 1000,
  };
}
