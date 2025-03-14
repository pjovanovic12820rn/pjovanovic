import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { FormsModule } from '@angular/forms';
import { CreatePaymentDto } from '../../models/create-payment-dto';
import { AlertService } from '../../services/alert.service';
import {AccountResponse} from '../../models/account-response.model';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./new-payment.component.css']
})
export class NewPaymentComponent {
  payment: CreatePaymentDto = {
    senderAccountNumber: '',
    receiverAccountNumber: '',
    amount: 0,
    paymentCode: '',
    purposeOfPayment: '',
    referenceNumber: ''
  };
  accounts: AccountResponse[] = [];

  constructor(
    private paymentService: PaymentService,
    private accountService: AccountService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts(0, 100).subscribe({
      next: (response) => {
        this.accounts = response.content;
      },
      error: () => {
        this.alertService.showAlert('error', 'Failed to load accounts. Please try again later.');
      }
    });
  }

  onSubmit(): void {
    this.paymentService.createPayment(this.payment).subscribe({
      next: (response) => {
        this.alertService.showAlert('success', 'Payment created!');
        this.router.navigate(['/transaction-overview']);
      },
      error: (error) => {
        this.alertService.showAlert('error', 'There has been an error: ' + error.message);
      }
    });
  }
}
