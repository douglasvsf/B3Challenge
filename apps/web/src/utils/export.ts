import { ChartDatum, QuoteResponse } from '../types/quotes';

export function exportToCSV(chartData: ChartDatum[], tickers: string[]): void {
  if (chartData.length === 0) return;

  const headers = ['Data', ...tickers];
  const rows = chartData.map((datum) => {
    const date = datum.date;
    const values = tickers.map((ticker) => datum[ticker] || '').join(',');
    return `${date},${values}`;
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `b3challenge_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(data: QuoteResponse): void {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `b3challenge_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

