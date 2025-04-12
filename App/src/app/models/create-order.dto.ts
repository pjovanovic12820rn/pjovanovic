export interface CreateOrderDto {
  listingId: number;
  orderType: string;
  quantity: number;
  limitValue?: number | null;
  stopValue?: number | null;
  allOrNone: boolean;
  margin: boolean;
  orderDirection: 'BUY' | 'SELL';
  contractSize: number;
  accountNumber: string;
}
