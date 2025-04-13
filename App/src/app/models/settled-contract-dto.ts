export interface SettledContractDto {
    id: number;
    stockSymbol: string;
    amount: number;
    strikePrice: number;
    currentPrice: number;
    premium: number;
    settlementDate: string;
    sellerInfo: string;
    profit: number;
    status: 'VALID' | 'EXPIRED';
    used: boolean;
}
