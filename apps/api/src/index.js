const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('API online'));
app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.get('/quotes', (req, res) => {
  const { tickers = '', start, end } = req.query;
  const requestedTickers = tickers
    .split(/[,\s]+/)
    .map((t) => t.trim().toUpperCase())
    .filter(Boolean);

  if (!requestedTickers.length) {
    return res.status(400).json({ error: 'Informe ao menos um ticker em "tickers".' });
  }

  if (!start || !end) {
    return res.status(400).json({ error: 'Os parâmetros "start" e "end" são obrigatórios (YYYY-MM-DD).' });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
    return res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD.' });
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: 'A data inicial deve ser anterior ou igual à data final.' });
  }

  const days = enumerateDays(startDate, endDate);
  const series = requestedTickers.map((ticker) => ({
    ticker,
    points: days.map((day, index) => ({
      date: formatDate(day),
      close: generateMockPrice(ticker, index),
    })),
  }));

  res.json({
    tickers: requestedTickers,
    range: { start: formatDate(startDate), end: formatDate(endDate) },
    series,
  });
});

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

function enumerateDays(startDate, endDate) {
  const days = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function generateMockPrice(ticker, dayIndex) {
  const base =
    ticker.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % 120;
  const trend = dayIndex * 1.5;
  const wave = Math.sin(dayIndex / 2 + base) * 4;
  return Number((50 + base / 3 + trend + wave).toFixed(2));
}