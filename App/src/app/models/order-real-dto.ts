export interface OrderRealDto {
  id: number;
  userId: number;
  listing: Listing;
  orderType: string;
  quantity: number;
  contractSize: number;
  pricePerUnit: number;
  direction: string;
  status: string;
  approvedBy: number;
  isDone: boolean;
  lastModification: Date;
  remainingPortions: number;
  stopPrice: number;
  stopFulfilled: boolean;
  afterHours: boolean;
  transactions: Transaction[];
  profit: number;
  clientName: string;
  accountNumber: string;
}


export interface Listing {
  id: number;
  listingType: string;
  ticker: string;
  price: number;
  change: number
  volume: number;
  initialMarginCost: number;
  exchangeMic: string;
  ask: number;
}

export interface Transaction {

  id: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  timestamp: Date;

}

