// TODO duplicate DODATI PROKLETI LISTING MRS NOSITE SER SVI VISE CITAJTE POROKLETI DTO SA BEKA MRSSSSSSSSSSSSSSSS
import {ListingDetailsDto} from './listing-details.dto';

export interface OrderDto {
  id: number;
  clientName: string;
  listing: ListingDetailsDto;
  orderType: string;
  quantity: number;
  pricePerUnit: number | null;
  direction: 'BUY' | 'SELL';
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'DONE';
  approvedBy: string | null;
  isDone: boolean;
  lastModification: string;
  orderDate: string;
  remainingPortions: number;
  afterHours: boolean;
  accountNumber: string;
}


