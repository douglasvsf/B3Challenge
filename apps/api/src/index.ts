import express, { Request, Response } from 'express';
import cors from 'cors';
import { QuoteQuery, QuoteResponse, QuoteSeries } from './types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.send('API online');
});

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/quotes', (req: Request<{}, QuoteResponse | { error: string }, {}, QuoteQuery>, res: Response): void => {
  const { tickers = '', start, end } = req.query;
  const requestedTickers = tickers
    .split(/[,\s]+/)
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  if (!requestedTickers.length) {
    res.status(400).json({ error: 'Informe ao menos um ticker em "tickers".' });
    return;
  }

  if (!start || !end) {
    res.status(400).json({ error: 'Os parâmetros "start" e "end" são obrigatórios (YYYY-MM-DD).' });
    return;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD.' });
    return;
  }

  if (startDate > endDate) {
    res.status(400).json({ error: 'A data inicial deve ser anterior ou igual à data final.' });
    return;
  }

  const days = enumerateDays(startDate, endDate);
  const series: QuoteSeries[] = requestedTickers.map((ticker) => ({
    ticker,
    points: days.map((day, index) => ({
      date: formatDate(day),
      close: generateMockPrice(ticker, index),
    })),
  }));

  const response: QuoteResponse = {
    tickers: requestedTickers,
    range: { start: formatDate(startDate), end: formatDate(endDate) },
    series,
  };

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

function enumerateDays(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function generateMockPrice(ticker: string, dayIndex: number): number {
  const base = ticker.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 120;
  const trend = dayIndex * 1.5;
  const wave = Math.sin(dayIndex / 2 + base) * 4;
  return Number((50 + base / 3 + trend + wave).toFixed(2));
}

