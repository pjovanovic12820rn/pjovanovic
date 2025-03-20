export interface Order {
  id: number;
  agent: string;
  orderType: string;
  asset: string;
  quantity: number;
  contractSize: number;
  pricePerUnit: number;
  direction: 'BUY' | 'SELL';
  remainingPortions: number;
  status: 'Pending' | 'Approved' | 'Declined' | 'Done';
  isTimeLimited: boolean;
  orderDate: string;
}

export interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}
