import {Component, inject, OnInit} from '@angular/core';
import { AccountService } from '../../services/account.service';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AccountTransfer} from '../../models/account-transfer';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {AccountResponse} from '../../models/account-response.model';
import {AuthService} from '../../services/auth.service';
import {PaymentService} from '../../services/payment.service';
import {TransferDto} from '../../models/transfer.model';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true,
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {

  private accountService = inject(AccountService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  accounts: AccountResponse[] = [];
  selectedFromAccountNumber: string | undefined;
  selectedToAccountNumber: string | undefined;
  transferAmount: number | undefined;

  // transfer: TransferDto = {
  //   senderAccountNumber = '',
  //   receiverAccountNumber = '',
  //   amount = 0
  // };

  ngOnInit(): void {
    this.accountService.getMyAccountsRegular().subscribe({
      next: (response) => {
        this.accounts = response;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load your account. Please try again later.');
        this.accounts = [];
      }
    });
  }

  get selectedFromAccount(): AccountResponse | undefined {
    return this.accounts.find(acc => acc.accountNumber === this.selectedFromAccountNumber);
  }

  get selectedToAccount(): AccountResponse | undefined {
    return this.accounts.find(acc => acc.accountNumber === this.selectedToAccountNumber);
  }

  onContinue(): void {
    if (!this.selectedFromAccount || !this.selectedToAccount || !this.transferAmount) {
      this.alertService.showAlert('error', 'Please fill in all fields.');
      return;
    }

    if (this.selectedFromAccount.availableBalance < this.transferAmount) {
      this.alertService.showAlert('error', 'You do not have enough funds.');
      return;
    }

    // if (this.selectedFromAccountNumber != null) {
    //   this.transfer.senderAccountNumber = this.selectedFromAccountNumber
    // }
    // if (this.selectedToAccountNumber != null) {
    //   this.transfer.receiverAccountNumber = this.selectedToAccountNumber
    // }
    // this.transfer.amount = this.transferAmount
    //
    // this.paymentService.transfer(this.transfer);

    this.alertService.showAlert('success', 'Transfer successful!');
    this.router.navigate(['/employees']);
  }

}
