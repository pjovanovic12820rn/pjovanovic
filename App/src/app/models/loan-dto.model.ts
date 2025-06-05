import { LoanRequestStatus, LoanType } from './loan-request.model';

export interface Loan {
  id?: number;
  loanNumber?: string;
  type?: LoanType;
  amount?: number;
  repaymentPeriod?: number;
  nominalInterestRate?: number;
  effectiveInterestRate?: number;
  startDate?: string;
  dueDate?: string;
  nextInstallmentAmount?: number;
  nextInstallmentDate?: string;
  remainingDebt?: number;
  currencyCode?: string;
  status?: LoanRequestStatus;
}
