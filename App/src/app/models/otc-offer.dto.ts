export interface OtcOfferDto {
    id: number;
    portfolioEntryId: number;
    buyerId: number;
    sellerId: number;
    amount: number;
    pricePerStock: number;
    premium: number;
    settlementDate: string;
    status: string;
    lastModified?: string;
  }