export interface PublicStockDto {
    portfolioEntryId: number;
    security: string;
    ticker: string;
    amount: number;
    price: number;
    lastModified: string;
    owner: string;
  }