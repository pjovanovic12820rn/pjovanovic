export interface Security {
  ticker: string;
  price: number;
  change: number;
  volume: number;
  initialMarginCost: number;
  maintenanceMargin: number;
  type: 'Stock' | 'Future' | 'Forex';
  settlementDate?: string;
}