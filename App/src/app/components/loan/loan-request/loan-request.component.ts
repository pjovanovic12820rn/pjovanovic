import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanRequestService } from '../../../services/loan-request.service';
import { AlertService } from '../../../services/alert.service';
import { LoanRequest, LoanType, EmploymentStatus, InterestRateType } from '../../../models/loan-request.model';
import { Currency } from '../../../models/currency.model';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { InputTextComponent } from '../../shared/input-text/input-text.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-loan-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextComponent, ButtonComponent],
  templateUrl: './loan-request.component.html',
  styleUrls: ['./loan-request.component.css']
})
export class LoanRequestComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loanRequestService = inject(LoanRequestService);
  private accountService = inject(AccountService);
  private alertService = inject(AlertService);
  private authService = inject(AuthService);

  loanForm!: FormGroup;
  availableCurrencies: Currency[] = [];
  userAccounts: { accountNumber: string; currencyCode: string }[] = [];
  success: boolean = false;

  constructor() {
    this.loanForm = new FormGroup({});
  }

  loanTypes: LoanType[] = ['CASH', 'MORTGAGE', 'AUTO', 'REFINANCING', 'STUDENT'];
  employmentStatuses: EmploymentStatus[] = ['PERMANENT', 'TEMPORARY', 'UNEMPLOYED'];
  interestRateTypes: InterestRateType[] = ['FIXED', 'CURRENT'];

  repaymentOptions: { [key in LoanType]: number[] } = {
    CASH: [12, 24, 36, 48, 60, 72, 84],
    MORTGAGE: [60, 120, 180, 240, 300, 360],
    AUTO: [12, 24, 36, 48, 60, 72, 84],
    REFINANCING: [12, 24, 36, 48, 60, 72, 84],
    STUDENT: [12, 24, 36, 48, 60, 72, 84]
  };

  get selectedLoanType(): LoanType | null {
    return this.loanForm.get('type')?.value as LoanType | null;
  }

  ngOnInit(): void {
    this.loanForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      currencyCode: ['', Validators.required],
      purpose: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      monthlyIncome: ['', [Validators.required, Validators.min(1)]],
      employmentStatus: ['', Validators.required],
      employmentDuration: ['', [Validators.required, Validators.min(0)]],
      repaymentPeriod: [{ value: '', disabled: true }, Validators.required],
      contactPhone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{9,15}$/)]],
      accountNumber: ['', [Validators.required, this.validateAccountCurrency.bind(this)]],
      interestRateType: ['', [Validators.required]]
    });

    this.availableCurrencies = this.loanRequestService.getAvailableCurrencies();

    // mozda treba drugacije ja samo menjam da ne bi pucao run!
    this.accountService.getMyAccountsRegular().subscribe({
      next: (response) => {
        this.userAccounts = response.map(acc => ({
          accountNumber: acc.accountNumber,
          currencyCode: acc.currencyCode
        }));
      },
      error: () => {
        this.alertService.showAlert('error', 'Error fetching user accounts.');
      }
    });

    this.loanForm.get('type')?.valueChanges.subscribe(selectedType => {
      if (!selectedType) {
        this.loanForm.get('repaymentPeriod')?.reset();
        this.loanForm.get('repaymentPeriod')?.disable();
      } else {
        this.loanForm.get('repaymentPeriod')?.enable();
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.loanForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  resetInvalidField(controlName: string): void {
    const control = this.loanForm.get(controlName);
    if (control?.invalid && control?.touched) {
      control.setValue('');
      control.setErrors(control.errors);
    }
  }


  validateAccountCurrency(control: AbstractControl): ValidationErrors | null {
    const selectedAccount = this.userAccounts.find(acc => acc.accountNumber === control.value);
    const selectedCurrency = this.loanForm.get('currencyCode')?.value;

    if (selectedAccount && selectedAccount.currencyCode !== selectedCurrency) {
      return { invalidCurrency: true };
    }
    return null;
  }

  navigateToPage(route: string): void {
    this.router.navigate([route]);
  }

  //da vrati ako odustane
  navigateToLoanManagement(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.router.navigate([`/loan-management/${userId}`]);
    } else {
      this.alertService.showAlert('error', 'User not authenticated');
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      const request: LoanRequest = this.loanForm.value;
      request.status = "PENDING"

      this.loanRequestService.submitLoanRequest(request).subscribe({
        next: (response: string) => {
          // this.success = true;
          // // this.alertService.showAlert('success', 'Loan request submitted successfully!');
          // this.alertService.showAlert('success', response);
          //
          this.router.navigate(['/success'], {
            state: {
              title: 'Loan Request Submitted!',
              message: response,
              buttonName: 'Go to Loan Management',
              continuePath: `/loan-management/${this.authService.getUserId()}`
            }
          });

        },
        error: () => {
          this.alertService.showAlert('error', 'An error occurred while submitting the request.');
        }
      });
    } else {
      this.loanForm.markAllAsTouched();
    }
  }
}
