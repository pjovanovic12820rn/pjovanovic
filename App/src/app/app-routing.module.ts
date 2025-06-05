// @ts-ignore
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';
import { clientOrActuaryGuard } from './guards/client-or-actuary-guard.guard';
import { employeeOrHigherRoleGuard } from './guards/employee-or-admin-guard.guard';
import { adminGuard } from './guards/admin-guard.guard';
import { supervisorGuard } from './guards/supervisor-guard.guard';
import { actuaryGuard } from './guards/actuary-guard.guard';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { EmployeesComponent } from './components/employee/employees/employees.component';
import { EditEmployeeComponent } from './components/employee/edit-employee/edit-employee.component';
import { RegisterEmployeeComponent } from './components/employee/register-employee/register-employee.component';
import { EditUserComponent } from './components/client/edit-user/edit-user.component';
import { RegisterUserComponent } from './components/client/register-user/register-user.component';
import { UserDetailComponent } from './components/client/user-detail/user-detail.component';
import { EmployeeDetailComponent } from './components/employee/employee-detail/employee-detail.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AccountCreationComponent} from './components/account/account-creation/account-creation.component';
import { CreateForeignCurrencyAccountComponent} from './components/account/create-foreign-currency-account/create-foreign-currency-account.component';
import { SecuritiesComponent } from './components/stocks/securities/securities.component';
import { MailComponent } from './components/shared/mail/mail.component';
import { CardsComponent} from './components/account/cards/cards.component';
import { ClientPortalComponent } from './components/client/client-portal/client-portal.component';
import { AccountManagementComponent} from './components/account/account-management/account-management.component';
import { TransferComponent } from './components/payments/transfer/transfer.component';
import { RecipientsComponent } from './components/payments/recipients/recipients.component';
import { LoanRequestComponent} from './components/loan/loan-request/loan-request.component';
import { ExchageRateListComponent } from './components/account/exchage-rate-list/exchage-rate-list.component';
import { NewPaymentComponent } from './components/payments/new-payment/new-payment.component';
import { NewTransactionComponent } from './components/payments/new-transaction/new-transaction.component';
import { TransactionDetailsComponent } from './components/payments/transaction-details/transaction-details.component';
import { TransactionListComponent } from './components/payments/transaction-list/transaction-list.component';
import { CreateCardComponent} from './components/account/create-card/create-card.component';
import { PaymentDetailsComponent } from './components/payments/payment-details/payment-details.component';
import { SuccessComponent } from './components/shared/success/success.component';
import { LoansComponent} from './components/loan/loans/loans.component';
import { MyPortfolioComponent } from './components/stocks/my-portfolio/my-portfolio.component';
import { LoanDetailsComponent} from './components/loan/loan-details/loan-details.component';
import { NewLoanRequestsComponent} from './components/loan/new-loan-requests/new-loan-requests.component';
import { OrderOverviewComponent } from './components/stocks/order-overview/order-overview.component';
import { TaxCalculationComponent } from './components/tax-calculation/tax-calculation.component';
import { BankAccountsComponent} from './components/account/bank-accounts/bank-accounts.component';
import { ActuaryManagementComponent } from './components/stocks/actuary-management/actuary-management.component';
import { SettledContractsComponent } from './components/stocks/settled-contracts/settled-contracts.component';
import { OtcOffersListComponent } from './components/stocks/otc-offers-list/otc-offers-list.component';
import { BankProfitComponent } from './components/stocks/bank-profit/bank-profit.component';
import { StockDetailsComponent } from './components/stocks/stock-details/stock-details.component';
import { ActiveOffersComponent } from './components/stocks/active-offers/active-offers.component';
import {MyOrdersComponent} from './components/stocks/my-orders/my-orders.component';

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
  { path: 'register-user', component: RegisterUserComponent, canActivate: [authGuard, employeeOrHigherRoleGuard] },
  { path: 'users/:id', component: EditUserComponent, canActivate: [authGuard, employeeOrHigherRoleGuard] },
  { path: 'user/:id', component: UserDetailComponent, canActivate: [authGuard] },

  // employees
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard, adminGuard] },
  { path: 'register-employee', component: RegisterEmployeeComponent, canActivate: [authGuard, adminGuard] },
  { path: 'employees/:id', component: EditEmployeeComponent, canActivate: [authGuard, adminGuard] },
  { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [authGuard] },
  { path: 'client-portal', component: ClientPortalComponent, canActivate: [authGuard, employeeOrHigherRoleGuard] },

  // accounts
  { path: 'account/:accountNumber', component: CardsComponent, canActivate: [authGuard] },
  { path: 'create-foreign-currency-account', component: CreateForeignCurrencyAccountComponent, canActivate: [authGuard, employeeOrHigherRoleGuard] },
  { path: 'create-current-account', component: AccountCreationComponent, canActivate: [authGuard, employeeOrHigherRoleGuard] },
  { path: 'account-management', component: AccountManagementComponent, canActivate: [authGuard] },
  { path: 'bank-accounts', component: BankAccountsComponent, canActivate: [authGuard, adminGuard] },

  // payments
  { path: 'transfer', component: TransferComponent, canActivate: [authGuard] }, // nzm koji guard treba
  { path: 'recipients', component: RecipientsComponent, canActivate: [authGuard] }, // client guard
  { path: 'new-payment', component: NewPaymentComponent, canActivate: [authGuard] }, // client guard
  { path: 'payment-details', component: PaymentDetailsComponent, canActivate: [authGuard] }, // client guard

  // cards and transactions
  { path: 'card/:cardNumber/transactions', component: TransactionListComponent, canActivate: [authGuard] },
  { path: 'card/:cardNumber/transactions/new', component: NewTransactionComponent, canActivate: [authGuard] },
  { path: 'transactions/:transactionId', component: TransactionDetailsComponent, canActivate: [authGuard] },
  { path: 'account/:accountNumber/create-card', component: CreateCardComponent, canActivate: [authGuard] },
  { path: 'loan-management/:clientId', component: LoansComponent, canActivate: [authGuard] },

  // exchange
  { path: 'exchange-rate', component: ExchageRateListComponent, canActivate: [authGuard] },

  // loans
  { path: 'loan-request', component: LoanRequestComponent, canActivate: [authGuard] },
  { path: 'loan-requests', component: NewLoanRequestsComponent, canActivate: [authGuard] },
  { path: 'loan-management/:clientId', component: LoansComponent, canActivate: [authGuard] },
  { path: 'loan-details/:loanId', component: LoanDetailsComponent, canActivate: [authGuard] },

  //success
  { path: 'success', component: SuccessComponent },

  // actuaries
  { path: 'actuaries', component: ActuaryManagementComponent, canActivate: [authGuard, supervisorGuard] },

  // securities & stocks
  { path: 'my-portfolio', component: MyPortfolioComponent, canActivate: [authGuard] },
  { path: 'securities', component: SecuritiesComponent, canActivate: [authGuard, clientOrActuaryGuard] },
  { path: 'tax-portal', component: TaxCalculationComponent, canActivate: [authGuard, supervisorGuard] },
  { path: 'stock-details/:id', component: StockDetailsComponent, canActivate: [authGuard] },

  // options
  { path: 'order-overview', component: OrderOverviewComponent, canActivate: [authGuard, supervisorGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },// treba supervisor gard, ovako ce biti dok se ne doda u beku
  { path: 'settled-contracts', component: SettledContractsComponent, canActivate: [authGuard] },
  { path: 'active-offers', component: ActiveOffersComponent, canActivate: [authGuard] },

  // otc
  { path: 'otc', component: OtcOffersListComponent, canActivate: [authGuard, clientOrActuaryGuard] },

  // bank profit
  { path: 'bank-profit', component: BankProfitComponent, canActivate: [authGuard] }
];
