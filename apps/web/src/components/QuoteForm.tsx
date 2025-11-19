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
    <section className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5">
      <form className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
          Ativos (separe por espaço ou vírgula)
          <input
            type="text"
            value={tickers}
            onChange={(event) => onTickersChange(event.target.value)}
            placeholder="Ex.: PETR4 VALE3"
            className="h-11 rounded-lg border border-slate-300 px-3 text-base font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
          Data inicial
          <input
            type="date"
            value={startDate}
            max={endDate}
            onChange={(event) => onStartDateChange(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 px-3 text-base font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
          Data final
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => onEndDateChange(event.target.value)}
            className="h-11 rounded-lg border border-slate-300 px-3 text-base font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </label>

        <div className="md:col-span-2 lg:col-span-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </div>
      </form>

      <p className="mt-4 text-sm text-slate-500">
        Todo o retorno é mockado no backend Express, simulando oscilações diárias para cada ticker.
      </p>
    </section>
  );
}

