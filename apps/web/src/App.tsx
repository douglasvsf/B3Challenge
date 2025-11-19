import { FormEvent, useState } from 'react';
import { PageHeader } from './components/PageHeader';
import { QuoteForm } from './components/QuoteForm';
import { QuoteResults } from './components/QuoteResults';
import { ChartDatum } from './types/quotes';
import {
  DEFAULT_TICKERS,
  addDays,
  formatDate,
  normalizeChartData,
  fetchQuotes,
} from './logic/quotes';

const today = new Date();
const initialEnd = formatDate(today);
const initialStart = formatDate(addDays(today, -7));

function App() {
  const [tickers, setTickers] = useState(DEFAULT_TICKERS);
  const [startDate, setStartDate] = useState(initialStart);
  const [endDate, setEndDate] = useState(initialEnd);
  const [chartData, setChartData] = useState<ChartDatum[]>([]);
  const [seriesMeta, setSeriesMeta] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = await fetchQuotes({
        tickers,
        start: startDate,
        end: endDate,
      });

      setSeriesMeta(payload.tickers ?? []);
      setChartData(normalizeChartData(payload.series ?? []));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha inesperada.';
      setChartData([]);
      setSeriesMeta([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-10 px-4 text-[var(--color-text)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PageHeader
          title="B3Challenge - Consulta de Ativos da B3"
          description="Informe tickers e intervalo de datas para visualizar os fechamentos simulados."
        />

        <QuoteForm
          tickers={tickers}
          startDate={startDate}
          endDate={endDate}
          loading={loading}
          onTickersChange={setTickers}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSubmit={handleSubmit}
        />

        <QuoteResults error={error} chartData={chartData} seriesMeta={seriesMeta} />
      </div>
    </div>
  );
}

export default App;

