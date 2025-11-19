import { FormEvent, useState } from 'react';
import { PageHeader } from './components/PageHeader';
import { QuoteForm } from './components/QuoteForm';
import { QuoteResults } from './components/QuoteResults';
import { HistoryPanel } from './components/HistoryPanel';
import { ChartDatum, QuoteResponse, QuoteQueryParams } from './types/quotes';
import { AppError, parseApiError } from './types/errors';
import { useRetry } from './hooks/useRetry';
import { saveToHistory } from './utils/history';
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
  const [lastResponse, setLastResponse] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const { executeWithRetry, isRetrying } = useRetry(fetchQuotes, {
    maxRetries: 3,
    delay: 1000,
    onRetry: (attempt) => {
      console.log(`Tentativa ${attempt} de 3...`);
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const params: QuoteQueryParams = {
        tickers,
        start: startDate,
        end: endDate,
      };

      const payload = await executeWithRetry(params);

      setSeriesMeta(payload.tickers ?? []);
      setChartData(normalizeChartData(payload.series ?? []));
      setLastResponse(payload);
      setError(null);

      // Salva no histórico
      saveToHistory(params, payload);
    } catch (err) {
      const appError = parseApiError(err);
      setChartData([]);
      setSeriesMeta([]);
      setLastResponse(null);
      setError(appError);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (params: QuoteQueryParams) => {
    setTickers(params.tickers);
    setStartDate(params.start);
    setEndDate(params.end);
  };

  const handleRetry = () => {
    if (error?.retryable) {
      handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] py-10 px-4 text-[var(--color-text)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <PageHeader
          title="B3Challenge - Consulta de Ativos da B3"
          description="Informe tickers e intervalo de datas para visualizar os fechamentos simulados."
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <QuoteForm
              tickers={tickers}
              startDate={startDate}
              endDate={endDate}
              loading={loading || isRetrying}
              onTickersChange={setTickers}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onSubmit={handleSubmit}
            />
          </div>
          <div className="pt-6">
            <HistoryPanel onSelectHistory={handleSelectHistory} />
          </div>
        </div>

        <QuoteResults
          error={error}
          chartData={chartData}
          seriesMeta={seriesMeta}
          loading={loading}
          lastResponse={lastResponse}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}

export default App;

