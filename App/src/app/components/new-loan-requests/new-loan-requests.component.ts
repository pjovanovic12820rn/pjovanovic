import { Component, OnInit } from '@angular/core';
import { LoanRequestService } from '../../services/loan-request.service';
import { Loan } from '../../models/loan-dto.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {LoanRequest} from '../../models/loan-request.model';

@Component({
  selector: 'app-new-loan-requests',
  imports: [ NgForOf, NgIf, NgClass],
  standalone: true,
  templateUrl: './new-loan-requests.component.html',
  styleUrl: './new-loan-requests.component.css'
})
export class NewLoanRequestsComponent implements OnInit {

  loanRequests: LoanRequest[] = [];

  constructor(private loanRequestService: LoanRequestService) { }

  ngOnInit(): void {
    this.loadLoanRequests();
  }

  loadLoanRequests(): void {
    this.loanRequestService.getAllLoanRequests().subscribe({
      next: (data) => {
        this.loanRequests = data.content;
      },
      error: (err) => {
        console.error('Error loading loan requests:', err);
        this.loanRequests = [];
      },
    });
  }

  approveLoan(loanId: number){
    console.log(loanId)
    if(loanId)
      this.loanRequestService.approveLoanRequest(loanId);
  }

  rejectLoan(loanId: number){
    this.loanRequestService.rejectLoanRequest(loanId);
  }

  getLoanStatusClass(status?: string): string {
    if (!status) return '';

    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'PAID':
        return 'status-paid';
      case 'PENDING':
        return 'status-pending';
      case 'APPROVED':
        return 'status-approved';
      case 'DEFAULTED':
        return 'status-defaulted';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  }

}
