export interface SecuritiesTransaction {
  clientId: number;
  role: string;
  name: string;
  lastname: string;
  accountNumber: number;
  transaction: number;
  transactionDate: string;
  securitiesType: string;
  paidPrice: number;
  soldPrice: number;
  profit: number;
  tax: number;
  paidFlag: string;
  date: string;
}
