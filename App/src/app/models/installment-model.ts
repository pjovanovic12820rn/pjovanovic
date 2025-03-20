export enum InstallmentStatus {
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DEFAULTED = 'DEFAULTED',
  REJECTED = 'REJECTED'
}

export interface Installment {
  amount: number;
  interestRate: number;
  expectedDueDate: string; // Using string to keep date format from backend
  actualDueDate?: string; // Optional, in case installment is not yet paid
  installmentStatus: InstallmentStatus;
}
