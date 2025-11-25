export type QuotePoint = {
  date: string;
  close: number;
};

export type QuoteSeries = {
  ticker: string;
  points: QuotePoint[];
};

export type QuoteResponse = {
  tickers: string[];
  range: {
    start: string;
    end: string;
  };
  series: QuoteSeries[];
};

export type ChartDatum = {
  date: string;
  [ticker: string]: string | number;
};

export type ApiProvider = 'yahoo' | 'brapi';

export type QuoteQueryParams = {
  tickers: string;
  start: string;
  end: string;
  api?: ApiProvider;
};

