import { ChartDatum, QuoteResponse } from '../types/quotes';
import { exportToCSV, exportToJSON } from '../utils/export';

type ExportButtonsProps = {
  chartData: ChartDatum[];
  tickers: string[];
  fullData?: QuoteResponse;
};

export function ExportButtons({ chartData, tickers, fullData }: ExportButtonsProps) {
  if (chartData.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={() => exportToCSV(chartData, tickers)}
        className="rounded-lg border border-[var(--color-border)] bg-[#050505] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[#0a0a0a] hover:border-[var(--color-primary)]"
        title="Exportar dados do gráfico para CSV"
      >
        📥 Exportar CSV
      </button>
      {fullData && (
        <button
          onClick={() => exportToJSON(fullData)}
          className="rounded-lg border border-[var(--color-border)] bg-[#050505] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[#0a0a0a] hover:border-[var(--color-primary)]"
          title="Exportar dados completos para JSON"
        >
          📥 Exportar JSON
        </button>
      )}
    </div>
  );
}

