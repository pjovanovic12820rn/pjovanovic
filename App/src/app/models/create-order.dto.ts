// Modify file: src/app/models/create-order.dto.ts
export interface CreateOrderDto {
  listingId: number;
  orderType: string;
  quantity: number;
  limitValue?: number | null;
  stopValue?: number | null;
  allOrNone: boolean;
  margin: boolean;
  orderDirection: 'BUY' | 'SELL'; // <--- RENAME THIS FIELD
  contractSize: number;
  accountNumber: string;
}