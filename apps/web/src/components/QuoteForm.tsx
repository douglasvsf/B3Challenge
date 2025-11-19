import { FormEvent, useState, useEffect } from 'react';
import { validateTickers, validateDateRange } from '../utils/validation';

type QuoteFormProps = {
  tickers: string;
  startDate: string;
  endDate: string;
  loading: boolean;
  onTickersChange(value: string): void;
  onStartDateChange(value: string): void;
  onEndDateChange(value: string): void;
  onSubmit(event: FormEvent<HTMLFormElement>): void;
};

export function QuoteForm({
  tickers,
  startDate,
  endDate,
  loading,
  onTickersChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
}: QuoteFormProps) {
  const [tickerError, setTickerError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ tickers: false, dates: false });

  useEffect(() => {
    if (touched.tickers) {
      setTickerError(validateTickers(tickers));
    }
  }, [tickers, touched.tickers]);

  useEffect(() => {
    if (touched.dates) {
      setDateError(validateDateRange(startDate, endDate));
    }
  }, [startDate, endDate, touched.dates]);

  const handleTickersChange = (value: string) => {
    onTickersChange(value);
    if (!touched.tickers) setTouched((prev) => ({ ...prev, tickers: true }));
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      onStartDateChange(value);
    } else {
      onEndDateChange(value);
    }
    if (!touched.dates) setTouched((prev) => ({ ...prev, dates: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ tickers: true, dates: true });

    const tickerErr = validateTickers(tickers);
    const dateErr = validateDateRange(startDate, endDate);

    setTickerError(tickerErr);
    setDateError(dateErr);

    if (!tickerErr && !dateErr) {
      onSubmit(event);
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-xl shadow-black/40">
      <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-[var(--color-muted)]">
            Ativos (separe por espaço ou vírgula)
          </label>
          <input
            type="text"
            value={tickers}
            onChange={(event) => handleTickersChange(event.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, tickers: true }))}
            placeholder="Ex.: PETR4 VALE3"
            className={`h-11 rounded-lg border bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition ${
              tickerError
                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30'
            }`}
            required
          />
          {tickerError && (
            <p className="text-xs text-red-400" role="alert">
              {tickerError}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-muted)]">Data inicial</label>
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(event) => handleDateChange('start', event.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, dates: true }))}
            className={`h-11 rounded-lg border bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition ${
              dateError
                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30'
            }`}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-muted)]">Data final</label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => handleDateChange('end', event.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, dates: true }))}
            className={`h-11 rounded-lg border bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition ${
              dateError
                ? 'border-red-400/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30'
            }`}
            required
          />
          {dateError && (
            <p className="text-xs text-red-400" role="alert">
              {dateError}
            </p>
          )}
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={loading || !!tickerError || !!dateError}
            className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-lg font-semibold text-black transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                Consultando...
              </span>
            ) : (
              'Consultar'
            )}
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Todo o retorno é mockado no backend Express, simulando oscilações diárias para cada ticker.
      </p>
    </section>
  );
}

