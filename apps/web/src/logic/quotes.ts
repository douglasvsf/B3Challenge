import { ChartDatum, QuoteQueryParams, QuoteResponse, QuoteSeries } from '../types/quotes';

export const DEFAULT_TICKERS = 'PETR4 VALE3';

export async function fetchQuotes(params: QuoteQueryParams): Promise<QuoteResponse> {
  const searchParams = new URLSearchParams({
    tickers: params.tickers,
    start: params.start,
    end: params.end,
  });

  const response = await fetch(`/quotes?${searchParams.toString()}`);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || 'Erro ao consultar API.');
  }

  return (await response.json()) as QuoteResponse;
}

export function normalizeChartData(series: QuoteSeries[] = []): ChartDatum[] {
  const map = new Map<string, ChartDatum>();

  series.forEach(({ ticker, points }) => {
    points.forEach(({ date, close }) => {
      const existing = map.get(date) ?? { date };
      existing[ticker] = close;
      map.set(date, existing);
    });
  });

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function addDays(date: Date, amount: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

