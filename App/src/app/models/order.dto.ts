export interface OrderDto {
    id: number;
    agent: string;
    asset: string;
    orderType: string;
    quantity: number;
    contractSize: number;
    pricePerUnit: number | null;
    direction: 'BUY' | 'SELL';
    status: string;
    approvedBy: string | null;
    isDone: boolean;
    lastModification: string;
    orderDate: string;
    remainingPortions: number;
    afterHours: boolean;
    isTimeLimited: boolean;
  }
