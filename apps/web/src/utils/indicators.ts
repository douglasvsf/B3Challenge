import { ChartDatum, QuoteSeries } from '../types/quotes';

export type Indicator = {
  ticker: string;
  currentPrice: number;
  firstPrice: number;
  variation: number;
  variationPercent: number;
  movingAverage7: number | null;
  movingAverage30: number | null;
  highest: number;
  lowest: number;
};

export function calculateIndicators(series: QuoteSeries[]): Indicator[] {
  return series.map(({ ticker, points }) => {
    if (points.length === 0) {
      return {
        ticker,
        currentPrice: 0,
        firstPrice: 0,
        variation: 0,
        variationPercent: 0,
        movingAverage7: null,
        movingAverage30: null,
        highest: 0,
        lowest: 0,
      };
    }

    const prices = points.map((p) => p.close);
    const firstPrice = prices[0];
    const currentPrice = prices[prices.length - 1];
    const variation = currentPrice - firstPrice;
    const variationPercent = firstPrice !== 0 ? (variation / firstPrice) * 100 : 0;
    const highest = Math.max(...prices);
    const lowest = Math.min(...prices);

    // Média móvel de 7 dias (últimos 7 pontos)
    const movingAverage7 =
      prices.length >= 7
        ? prices.slice(-7).reduce((sum, price) => sum + price, 0) / 7
        : prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // Média móvel de 30 dias (últimos 30 pontos, ou todos se menos)
    const movingAverage30 =
      prices.length >= 30
        ? prices.slice(-30).reduce((sum, price) => sum + price, 0) / 30
        : null;

    return {
      ticker,
      currentPrice,
      firstPrice,
      variation,
      variationPercent,
      movingAverage7,
      movingAverage30,
      highest,
      lowest,
    };
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

