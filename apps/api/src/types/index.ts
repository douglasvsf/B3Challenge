export interface QuotePoint {
  date: string;
  close: number;
}

export interface QuoteSeries {
  ticker: string;
  points: QuotePoint[];
}

export interface QuoteResponse {
  tickers: string[];
  range: {
    start: string;
    end: string;
  };
  series: QuoteSeries[];
}

export type ApiProvider = 'yahoo' | 'brapi';

export interface QuoteQuery {
  tickers?: string;
  start?: string;
  end?: string;
  api?: ApiProvider;
}

