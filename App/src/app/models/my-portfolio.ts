

export interface MyPortfolio {

  id: number;
  listingId: number;
  securityName: string;  // listing name
  ticker: string;  // listing ticker
  Type: string; // STOCK OPTION ..
  amount: number;
  averagePrice: number;
  profit: number;
  lastModified: Date;
  publicAmount: number;
  inTheMoney: boolean;
  used: boolean; /// those two only for OPTIONs

}


