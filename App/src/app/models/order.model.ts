export interface Order {
    id: number;
    agent: string;
    orderType: string;
    asset: string;
    quantity: number;
    contractSize: number;
    pricePerUnit: number;
    direction: string;
    remainingPortions: number;
    status: 'Pending' | 'Approved' | 'Declined' | 'Done';
    isTimeLimited: boolean;
    orderDate: string; 
  }
  