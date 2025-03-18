export type LoanType = 'CASH' | 'MORTGAGE' | 'CAR' | 'REFINANCING' | 'STUDENT';
export type EmploymentStatus = 'PERMANENT' | 'TEMPORARY' | 'UNEMPLOYED';
export type LoanRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type InterestRateType = 'FIXED' | 'CURRENT';

export interface LoanRequest {
  type: LoanType;
  amount: number;
  purpose: string;
  monthlyIncome: number;
  employmentStatus: EmploymentStatus;
  employmentDuration: number;
  repaymentPeriod: number;
  contactPhone: string;
  accountNumber: string;
  currencyCode: string;
  status?: LoanRequestStatus;
  interestRateType: InterestRateType;
}
