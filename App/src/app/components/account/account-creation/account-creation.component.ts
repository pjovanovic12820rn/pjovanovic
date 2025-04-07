import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { User } from '../../../models/user.model';
import { NewBankAccount } from '../../../models/new-bank-account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Employee } from '../../../models/employee.model';
import { AlertService } from '../../../services/alert.service';
import { CompanyService } from '../../../services/company.service';
import { Company, CreateCompany } from '../../../models/company.model';
import { AuthorizedPersonnel, CreateAuthorizedPersonnel } from '../../../models/authorized-personnel.model';
import { AuthorizedPersonnelService } from '../../../services/authorized-personnel.service';
import { CardService, CreateCardDto } from '../../../services/card.service';
import {NgForOf, NgIf, TitleCasePipe} from '@angular/common';
import {ButtonComponent} from '../../shared/button/button.component';
import {InputTextComponent} from '../../shared/input-text/input-text.component';
import {ModalComponent} from '../../shared/modal/modal.component';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    NgForOf,
    ButtonComponent,
    InputTextComponent,
    NgIf,
    ModalComponent,
  ],
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent implements OnInit {

  loggedInEmployee: Employee | null = null;
  users: User[] = [];
  isCurrentAccount = true;
  isCompanyAccount = false;
  employeeId: number | null = null;
  isCurrAdmin: boolean = false;
  showCardModal: boolean = false;
  loadingCompanies = false;
  companies: Company[] = [];
  availablePersonnel: AuthorizedPersonnel[] = [];
  isNewCompany = false;
  isNewPersonnel = false;

  newCard: CreateCardDto = {
    accountNumber: '',
    name: '',
    type: 'DEBIT',
    issuer: 'VISA',
    cardLimit: 0
  };

  newAccount: NewBankAccount = {
    currency: 'RSD',
    clientId: 0,
    employeeId: 0,
    initialBalance: 0,
    dailyLimit: 0,
    monthlyLimit: 0,
    dailySpending: 0,
    monthlySpending: 0,
    isActive: 'INACTIVE',
    accountType: 'CURRENT',
    accountOwnerType: 'PERSONAL',
    createCard: false,
    monthlyFee: 0,
    name: '',
  };

  companyInfo = {
    name: '',
    registrationNumber: '',
    taxNumber: '',
    activityCode: '',
    address: '',
    majorityOwner: ''
  };

  // Reakt. forme
  accountForm!: FormGroup;
  cardForm!: FormGroup;
  newPersonnelForm!: FormGroup;

  selectedCompanyId: number | null = null;
  selectedAuthorizedPersonnelId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: ClientService,
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private cardService: CardService,
    private authorizedPersonnelService: AuthorizedPersonnelService
  ) {}

  ngOnInit(): void {
    this.accountForm = this.fb.group({
      clientId: [this.newAccount.clientId, Validators.required],
      accountType: [{ value: this.newAccount.accountType, disabled: true }],
      monthlyFee: [this.newAccount.monthlyFee],
      accountOwnerType: [this.newAccount.accountOwnerType, Validators.required],
      // sel i company info
      selectedCompany: [this.selectedCompanyId],
      selectedAuthorizedPersonnel: [this.selectedAuthorizedPersonnelId],
      companyName: [this.companyInfo.name],
      registrationNumber: [this.companyInfo.registrationNumber],
      taxNumber: [this.companyInfo.taxNumber],
      activityCode: [this.companyInfo.activityCode],
      companyAddress: [this.companyInfo.address],

      name: [this.newAccount.name, Validators.required],
      dailyLimit: [this.newAccount.dailyLimit, Validators.required],
      monthlyLimit: [this.newAccount.monthlyLimit, Validators.required],
      currency: [{ value: this.newAccount.currency, disabled: true }],
      isActive: [this.newAccount.isActive],
      createCard: [this.newAccount.createCard]
    });

    // card modal
    this.cardForm = this.fb.group({
      type: [this.newCard.type, Validators.required],
      issuer: [this.newCard.issuer, Validators.required],
      name: [this.newCard.name, Validators.required],
      cardLimit: [this.newCard.cardLimit, Validators.required],
    });

    // New auth personela
    this.newPersonnelForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
    });

    const isAdmin = this.authService.isAdmin();
    const isEmployee = this.authService.isEmployee();
    this.isCurrAdmin = isAdmin;
    if (!(isAdmin || isEmployee)) {
      alert("Access denied. Only employees and admins can create accounts.");
      this.router.navigate(['/']);
      return;
    }
    this.loadUsers();
    this.employeeId = this.authService.getUserId();
    if (this.employeeId) {
      this.newAccount.employeeId = this.employeeId;
      if (!this.isCurrAdmin) {
        this.employeeService.getEmployeeSelf().subscribe(
          (employee) => {
            this.loggedInEmployee = employee;
          },
          (error) => {
            console.error('Error fetching employee details:', error);
          }
        );
      }
    }
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      if (userId) {
        this.accountForm.patchValue({ clientId: +userId });
        if (this.isCompanyAccount) {
          this.loadCompaniesForClient();
        }
      }
    });
  }

  navigateToRegisterUser() {
    this.router.navigate(['/register-user'], { queryParams: { redirect: 'current-account' } });
  }

  loadUsers() {
    this.userService.getAllUsers(0, 100).subscribe({
      next: (response) => {
        this.users = response.content;
      },
      error: (error) => console.error('Failed to load users:', error)
    });
  }

  private loadAvailablePersonnel(companyId: number): void {
    this.authorizedPersonnelService.getByCompany(companyId).subscribe({
      next: (personnel) => {
        this.availablePersonnel = personnel;
      },
      error: (error) => console.error('Failed to load personnel:', error)
    });
  }

  onAccountOwnerTypeChange() {
    this.isCompanyAccount = this.accountForm.get('accountOwnerType')?.value === 'COMPANY';
    if (this.isCompanyAccount && this.accountForm.get('clientId')?.value) {
      this.loadCompaniesForClient();
    }
    if (!this.isCompanyAccount) {
      this.accountForm.patchValue({ selectedCompany: null });
      this.selectedCompanyId = null;
      this.isNewCompany = false;
    }
  }

  toggleIsActive() {
    const current = this.accountForm.get('isActive')?.value;
    this.accountForm.get('isActive')?.setValue(current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
  }

  toggleCreateCard() {
    const current = this.accountForm.get('createCard')?.value;
    this.accountForm.get('createCard')?.setValue(!current);
  }

  isCompanyFormValid(): boolean {
    if (!this.isCompanyAccount) return true;

    if (!this.isNewCompany && !this.accountForm.get('selectedCompany')?.value) return false;

    if (this.isNewCompany) {
      const { companyName, registrationNumber, taxNumber, activityCode, companyAddress } = this.accountForm.getRawValue();
      if (
        !companyName.trim() ||
        !registrationNumber.trim() ||
        !taxNumber.trim() ||
        !activityCode.trim() ||
        !companyAddress.trim()
      ) {
        return false;
      }
    }

    if (this.isNewPersonnel) {
      if (this.newPersonnelForm.invalid) {
        return false;
      }
    }
    return true;
  }

  onClientChange() {
    if (this.accountForm.get('clientId')?.value && this.isCompanyAccount) {

      this.loadCompaniesForClient();
    }
  }

  private loadCompaniesForClient() {
    this.loadingCompanies = true;
    this.accountForm.get('selectedCompany')?.disable();

    const clientId = this.accountForm.get('clientId')?.value;
    this.companyService.getCompaniesByClientId(clientId).subscribe({
      next: (companies) => {
        this.companies = companies;
        this.loadingCompanies = false;
        this.accountForm.get('selectedCompany')?.enable();

      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.loadingCompanies = false;
        this.accountForm.get('selectedCompany')?.enable();

      }
    });
  }

  onCompanySelect() {
    const selected = +this.accountForm.get('selectedCompany')?.value;
    this.selectedCompanyId = selected;
    if (selected === -1) { // create new company selected
      this.isNewCompany = true;
      this.resetCompanyForm();
      this.availablePersonnel = [];
    } else {
      this.isNewCompany = false;
      const selectedCompany = this.companies.find(c => c.id === selected);
      if (selectedCompany) {
        this.populateCompanyForm(selectedCompany);
        this.loadAvailablePersonnel(selectedCompany.id);
      } else {
        this.resetCompanyForm();
        this.availablePersonnel = [];
      }
    }
    this.isNewPersonnel = false;
    this.accountForm.patchValue({ selectedAuthorizedPersonnel: null });
  }

  onPersonnelSelect() {
    const selected = +this.accountForm.get('selectedAuthorizedPersonnel')?.value;
    this.selectedAuthorizedPersonnelId = selected;
    this.isNewPersonnel = selected === -1;
    if (!this.isNewPersonnel) {
      this.newPersonnelForm.reset();
    }
  }

  private populateCompanyForm(company: Company) {
    this.accountForm.patchValue({
      companyName: company.name,
      registrationNumber: company.registrationNumber,
      taxNumber: company.taxId,
      activityCode: company.activityCode,
      companyAddress: company.address
    });
  }

  private resetCompanyForm() {
    this.accountForm.patchValue({
      companyName: '',
      registrationNumber: '',
      taxNumber: '',
      activityCode: '',
      companyAddress: ''
    });
  }

  getClientName(clientId: number | string): string { //bio je : number
    const id = typeof clientId === 'string' ? parseInt(clientId, 10) : clientId;
    const client = this.users.find(u => u.id === id);
    return client ? `${client.firstName} ${client.lastName}` : 'Unknown';
  }

  async onSubmit() {
    try {
      let companyId: number | undefined;
      let authorizedPersonId: number | undefined;
      const formValue = this.accountForm.getRawValue();

      if (this.isCompanyAccount) {
        if (this.isNewCompany) {
          const createCompanyDto: CreateCompany = {
            name: formValue.companyName,
            registrationNumber: formValue.registrationNumber,
            taxId: formValue.taxNumber,
            activityCode: formValue.activityCode,
            address: formValue.companyAddress,
            majorityOwner: formValue.clientId
          };
          try {
            const newCompany = await this.companyService.createCompany(createCompanyDto).toPromise();
            if (newCompany && 'id' in newCompany) {
              companyId = newCompany.id;
            }
          } catch (error: any) {
            const errorMessage = error?.error?.message || 'Failed to create company (try different tax number or registration number)';
            this.alertService.showAlert('error', errorMessage);
            return;
          }
        } else {
          companyId = formValue.selectedCompany || undefined;
        }

        if (this.isNewPersonnel && companyId) {
          const createPersonnelDto: CreateAuthorizedPersonnel = {
            ...this.newPersonnelForm.value,
            companyId: companyId
          };
          try {
            const createdPersonnel = await this.authorizedPersonnelService.createAuthorizedPersonnel(createPersonnelDto).toPromise();
            if (createdPersonnel && 'id' in createdPersonnel) {
              authorizedPersonId = createdPersonnel.id;
            }
          } catch (error: any) {
            const errorMessage = error?.error?.message || 'Failed to create authorized personnel';
            this.alertService.showAlert('error', errorMessage);
            return;
          }
        } else if (formValue.selectedAuthorizedPersonnel) {
          authorizedPersonId = formValue.selectedAuthorizedPersonnel;
        }
      }

      // Merge company/personnel data into the account payload.
      this.newAccount = {
        ...this.newAccount,
        ...formValue,
        companyId: companyId,
        authorizedPersonId: authorizedPersonId
      };

      this.accountService.createCurrentAccount(this.newAccount).subscribe({
        next: (createdAccount) => {
          if (this.accountForm.get('createCard')?.value) {
            this.newCard.accountNumber = createdAccount.accountNumber;
            this.showCardModal = true;
          } else {
            this.alertService.showAlert('success', 'Account created successfully!');
            this.router.navigate(['/success'], {
              state: {
                title: 'Account Created!',
                message: 'The account has been successfully created.',
                buttonName: 'Go to Client Portal',
                continuePath: '/client-portal'
              }
            });
          }
        },
        error: (error) => {
          console.error('Failed to create account:', error);
          this.alertService.showAlert('error', 'Failed to create account');
        }
      });
    } catch (error) {
      console.error('Error creating company:', error);
      this.alertService.showAlert('error', 'Failed to create company');
    }
  }

  submitCardForm(): void {
    const request = this.authService.isClient()
      ? this.cardService.requestCard(this.cardForm.getRawValue())
      : this.cardService.createCard(this.cardForm.getRawValue());

    request.subscribe({
      next: () => {
        this.showCardModal = false;
        this.router.navigate(['/success'], {
          state: {
            title: 'Card Created!',
            message: 'The card has been successfully created.',
            buttonName: 'Go to Account',
            continuePath: `/account/${this.newCard.accountNumber}`
          }
        });
      },
      error: (err) => {
        this.alertService.showAlert('error', 'Failed to create card.');
        console.error(err);
      }
    });
  }
}
