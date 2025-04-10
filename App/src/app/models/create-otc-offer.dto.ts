export interface CreateOtcOfferDto {
    portfolioEntryId: number;
    amount: number;
    pricePerStock: number;
    premium: number;
    settlementDate: string;
  }