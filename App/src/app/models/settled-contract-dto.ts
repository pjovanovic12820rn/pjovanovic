export interface SettledContractDto {
    id: number;
    stockName: string;
    amount: number;
    strikePrice: number;
    premium: number;   
    settlementDate: string;
    sellerInfo: string; 
    profit: number;    
    status: 'ACTIVE' | 'EXPIRED' | 'EXECUTED';
    isOption?: boolean;
  }
  