export interface TimeSeriesDto {
  meta: MetaDto;
  values: TimeSeriesValueDto[];
  status: string;
}

export interface MetaDto {
  symbol: string;
  interval: string;
  currency: string;
  currency_base: string;
  currency_quote: string;
  exchange: string;
  type: string;
}

export interface TimeSeriesValueDto {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
