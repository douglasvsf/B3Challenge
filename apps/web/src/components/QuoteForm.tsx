import { FormEvent } from 'react';

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
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-xl shadow-black/40">
      <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)] md:col-span-2">
          Ativos (separe por espaço ou vírgula)
          <input
            type="text"
            value={tickers}
            onChange={(event) => onTickersChange(event.target.value)}
            placeholder="Ex.: PETR4 VALE3"
            className="h-11 rounded-lg border border-[var(--color-border)] bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
          Data inicial
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-11 rounded-lg border border-[var(--color-border)] bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-muted)]">
          Data final
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="h-11 rounded-lg border border-[var(--color-border)] bg-[#050505] px-3 text-base font-normal text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
            required
          />
        </label>

        <div className="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-lg font-semibold text-black transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Todo o retorno é mockado no backend Express, simulando oscilações diárias para cada ticker.
      </p>
    </section>
  );
}

