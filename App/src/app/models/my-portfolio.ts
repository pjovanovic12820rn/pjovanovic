import {ListingType} from '../enums/listing-type.enum';

export interface MyPortfolio {

  id: number;
  listingId: number;
  securityName: string;  // listing name
  ticker: string;  // listing ticker
  type: ListingType; // STOCK OPTION ..
  amount: number;
  averagePrice: number;
  profit: number;
  lastModified: Date;
  publicAmount: number;
  inTheMoney: boolean;
  used: boolean; /// those two only for OPTIONs
  currentPrice: number;
  reservedAmount: number;
}

export interface UseListing {
  portfolioEntryId: number
}
