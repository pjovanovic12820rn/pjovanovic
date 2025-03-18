import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard, adminGuard, employeeGuard, employeeOrAdminGuard } from './guards/auth-guard.guard';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/register-employee/register-employee.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AccountCreationComponent } from './components/account-creation/account-creation.component';
import { CreateForeignCurrencyAccountComponent } from './components/create-foreign-currency-account/create-foreign-currency-account.component';
import { MailComponent } from './components/mail/mail.component';
import { CardsComponent } from './components/cards/cards.component';
import { ClientPortalComponent } from './components/client-portal/client-portal.component';
import { AccountManagementComponent } from './components/account-management/account-management.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { RecipientsComponent } from './components/recipients/recipients.component';
import { LoanRequestComponent } from './components/loan-request/loan-request.component';
import { ExchageRateListComponent } from './components/exchage-rate-list/exchage-rate-list.component';
import { NewPaymentComponent } from './components/new-payment/new-payment.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { CreateCardComponent } from './components/create-card/create-card.component';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { SuccessComponent } from './components/success/success.component';
import { LoansComponent } from './components/loans/loans.component';

export const routes: Routes = [
  // login
  { path: '', component: WelcomeComponent },
  { path: 'login/:type', component: LoginComponent },

  // password
  { path: 'forgot-password', component: MailComponent },
  { path: 'set-password/:token', component: PasswordResetComponent },
  { path: 'reset-password/:token', component: PasswordResetComponent },
  { path: 'forgot-password', component: MailComponent },

  // users
  { path: 'register-user', component: RegisterUserComponent, canActivate: [employeeOrAdminGuard, authGuard] },
  { path: 'users/:id', component: EditUserComponent, canActivate: [employeeOrAdminGuard, authGuard] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [authGuard] },

  // employees
  { path: 'employees', component: EmployeesComponent, canActivate: [adminGuard, authGuard] },
  { path: 'register-employee', component: RegisterEmployeeComponent, canActivate: [adminGuard, authGuard] },
  { path: 'employees/:id', component: EditEmployeeComponent, canActivate: [adminGuard, authGuard] },
  { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [authGuard] },
  { path: 'client-portal', component: ClientPortalComponent, canActivate: [authGuard] },

  // accounts
  { path: 'account/:accountNumber', component: CardsComponent, canActivate: [authGuard] },
  { path: 'create-foreign-currency-account', component: CreateForeignCurrencyAccountComponent, canActivate: [employeeOrAdminGuard] },
  { path: 'create-current-account', component: AccountCreationComponent, canActivate: [employeeOrAdminGuard] },
  { path: 'account-management', component: AccountManagementComponent, canActivate: [authGuard] },

  // payments
  { path: 'transfer', component: TransferComponent, canActivate: [authGuard] },
  { path: 'recipients', component: RecipientsComponent, canActivate: [authGuard] },
  { path: 'new-payment', component: NewPaymentComponent, canActivate: [authGuard] },
  { path: 'payment-details', component: PaymentDetailsComponent, canActivate: [authGuard] },

  // cards and transactions
  { path: 'card/:cardNumber/transactions', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'card/:cardNumber/transactions/new', component: NewTransactionComponent, canActivate: [authGuard] },
  { path: 'transactions/:transactionId', component: TransactionDetailsComponent, canActivate: [authGuard] },
  { path: 'account/:accountNumber/create-card', component: CreateCardComponent, canActivate: [authGuard] },

  // exchange
  { path: 'exchange-rate', component: ExchageRateListComponent, canActivate: [authGuard] },

  // loans
  { path: 'loan-request', component: LoanRequestComponent, canActivate: [authGuard] },
  { path: 'loan-management/:clientId', component: LoansComponent, canActivate: [authGuard] },

  // success
  { path: 'success', component: SuccessComponent }

];

