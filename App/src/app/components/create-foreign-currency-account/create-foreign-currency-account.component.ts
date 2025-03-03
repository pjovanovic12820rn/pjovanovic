import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { Currency } from '../../models/currency.model';

@Component({
  selector: 'app-create-foreign-currency-account',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-foreign-currency-account.component.html',
  styleUrl: './create-foreign-currency-account.component.css'
})
export class CreateForeignCurrencyAccountComponent implements OnInit {
  accountForm: FormGroup;
  isBusinessAccount = false;
  users: User[] = [];
  currencies: Currency[] = [];
  generatedAccountNumber: string = '';
  private userService = inject(UserService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private alertService = inject(AlertService);

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      accountType: ['client'],
      currency: ['', Validators.required],
      companyName: ['', Validators.required],
      companyRegistrationNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      taxIdentificationNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      companyActivityCode: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{2}$/)]],
      companyAddress: ['', Validators.required],
      majorityOwnerId: ['', Validators.required],
      ownerId: ['', Validators.required],
      accountNumber: ['']
    });
  }

  ngOnInit(): void {
    this.accountForm.get('accountType')?.valueChanges.subscribe(accountType => {
      this.isBusinessAccount = accountType === 'business';
      this.updateBusinessFieldsVisibility();
      this.generateAccountNumber();
    });
    this.updateBusinessFieldsVisibility();

    this.loadUsers();
    this.preselectNewUser();
    this.loadCurrencies();
    this.generateAccountNumber();
  }

  private loadUsers() {
    this.userService.getAllUsers(0, 1000).subscribe({
      next: (response) => {
        this.users = response.content;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  private preselectNewUser() {
    this.activatedRoute.queryParams.subscribe(params => {
      const newUserId = params['newUserId'];
      if (newUserId) {
        this.accountForm.patchValue({ ownerId: newUserId });
      }
    });
  }

  private loadCurrencies() { // mock data, should be loaded from the server when implemented
    this.currencies = [
      { code: 'RSD', name: 'Serbian Dinar', symbol: 'RSD', country: ['Serbia'], description: 'Serbian Dinar', isActive: true },
      { code: 'EUR', name: 'Euro', symbol: '€', country: ['Germany', 'Slovenia', "Other EU"], description: 'Euro', isActive: true },
      { code: 'USD', name: 'US Dollar', symbol: '$', country: ['USA'], description: 'US Dollar', isActive: true },
      { code: 'CHF', name: 'Swiss Franc' , symbol: 'CHF', country: ['Switzerland'], description: 'Swiss Franc', isActive: true },
    ];

    const rsdIndex = this.currencies.findIndex(currency => currency.code === 'RSD');
    if (rsdIndex > -1) this.currencies.splice(rsdIndex, 1);
  }

  generateAccountNumber() {
    const bankCode = '111';
    const branchCode = '0001';
    const accountNumberDigits = 9;
    const randomNumber = Math.random().toString().slice(2, 2 + accountNumberDigits).padEnd(accountNumberDigits, '0');
    const accountType = this.accountForm.get('accountType')?.value === 'business' ? '22' : '21';

    this.generatedAccountNumber = `${bankCode}${branchCode}${randomNumber}${accountType}`;
    this.accountForm.patchValue({ accountNumber: this.generatedAccountNumber });
  }


  updateBusinessFieldsVisibility() {
    if (this.isBusinessAccount) {
      this.accountForm.controls['companyName'].enable();
      this.accountForm.controls['companyRegistrationNumber'].enable();
      this.accountForm.controls['taxIdentificationNumber'].enable();
      this.accountForm.controls['companyActivityCode'].enable();
      this.accountForm.controls['companyAddress'].enable();
      this.accountForm.controls['majorityOwnerId'].enable();
    } else {
      this.accountForm.controls['companyName'].disable();
      this.accountForm.controls['companyRegistrationNumber'].disable();
      this.accountForm.controls['taxIdentificationNumber'].disable();
      this.accountForm.controls['companyActivityCode'].disable();
      this.accountForm.controls['companyAddress'].disable();
      this.accountForm.controls['majorityOwnerId'].disable();
    }
  }

  onSubmit() {
    if (this.accountForm.invalid) {
      Object.keys(this.accountForm.controls).forEach(key => {
        this.accountForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.accountService.createAccount(this.accountForm.value).subscribe({
      next: (response) => {
        console.log('Account creation successful:', response);
        this.alertService.showAlert('success', 'Account created successfully!');
      },
      error: (error) => {
        console.error('Account creation error:', error);
        this.alertService.showAlert('error', 'Failed to create account. Please try again.');
      }
    });
  }

  onCreateNewUserClick() {
    this.router.navigate(['/register-user']);
  }
}
