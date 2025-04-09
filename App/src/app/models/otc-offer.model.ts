
export interface OtcOffer {
    id: number;
    securityType: string;
    symbol: string;
    amount: number;
    price: number;
    profit: number;
    lastModified: Date;
    owner: string;
  }