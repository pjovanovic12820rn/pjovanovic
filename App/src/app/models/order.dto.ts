// TODO duplicate DODATI PROKLETI LISTING MRS NOSITE SER SVI VISE CITAJTE POROKLETI DTO SA BEKA MRSSSSSSSSSSSSSSSS
export interface OrderDto {
  id: number;
  clientName: string;
  asset: string;
  orderType: string;
  quantity: number;
  contractSize: number;
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


