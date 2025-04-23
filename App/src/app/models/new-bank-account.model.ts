export interface NewBankAccount {
  currency: string;
  clientId: number;
  employeeId: number;
  companyId?: number;
  initialBalance: number;
  dailySpending: number;
  monthlySpending: number;
  isActive: string;
  accountType: string;
  accountOwnerType: string;
  createCard: boolean;
  authorizedPersonId?: number;
  name: string;
}
