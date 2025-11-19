import { useState } from 'react';
import './App.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const DEFAULT_TICKERS = 'PETR4 VALE3';
const today = new Date();
const initialEnd = formatDate(today);
const initialStart = formatDate(addDays(today, -7));
const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f97316', '#7c3aed', '#0891b2'];

function App() {
  const [tickers, setTickers] = useState(DEFAULT_TICKERS);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [chartData, setChartData] = useState([]);
  const [seriesMeta, setSeriesMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams({
        tickers,
        start: startDate,
        end: endDate,
      });

      const response = await fetch(`/quotes?${params.toString()}`);
      if (!response.ok) {
        const { error: message } = await response.json().catch(() => ({ error: 'Erro ao consultar API.' }));
        throw new Error(message || 'Erro ao consultar API.');
      }

      const payload = await response.json();
      setSeriesMeta(payload.tickers || []);
      setChartData(normalizeChartData(payload.series));
    } catch (err) {
      setChartData([]);
      setSeriesMeta([]);
      setError(err.message || 'Falha inesperada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Consulta Mockada de Ativos B3</h1>
        <p>Informe tickers e intervalo de datas para visualizar os fechamentos simulados.</p>
      </header>

      <section className="card">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Ativos (separe por espaço ou vírgula)
            <input
              type="text"
              value={tickers}
              onChange={(event) => setTickers(event.target.value)}
              placeholder="Ex.: PETR4 VALE3"
              required
            />
          </label>

          <label>
            Data inicial
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </label>

          <label>
            Data final
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>

        <p className="helper-text">
          Todo o retorno é mockado no backend Express, simulando oscilações diárias para cada ticker.
        </p>
      </section>

      <section className="card">
        {error && <p className="error">{error}</p>}

        {!chartData.length && !error && (
          <p className="helper-text">Preencha o formulário acima para gerar o gráfico.</p>
        )}

        {chartData.length > 0 && (
          <>
            <div className="status-row">
              <strong>Resultados:</strong>
              <span>{seriesMeta.join(', ')}</span>
            </div>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="4 4" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend />
                  {seriesMeta.map((ticker, index) => (
                    <Line
                      key={ticker}
                      type="monotone"
                      dataKey={ticker}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function normalizeChartData(series = []) {
  const map = new Map();

  series.forEach(({ ticker, points }) => {
    points.forEach(({ date, close }) => {
      if (!map.has(date)) {
        map.set(date, { date });
      }
      map.get(date)[ticker] = close;
    });
  });

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function addDays(date, amount) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

export default App;
