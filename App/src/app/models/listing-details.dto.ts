import { ListingType } from '../enums/listing-type.enum';
import { PriceHistoryDto } from './price-history.dto';

export interface ListingDetailsDto {
  id: number;
  listingType: ListingType;
  ticker: string;
  name: string;
  currentPrice: number; 
  exchangeMic: string;
  priceHistory: PriceHistoryDto[];
  contractSize: number | null;
  contractUnit: string | null;
  optionSettlementDates: string[];
}