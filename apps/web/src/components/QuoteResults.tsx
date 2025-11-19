import { useMemo } from 'react';
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
import { ChartDatum } from '../types/quotes';
import { ChartSkeleton } from './ChartSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { AppError } from '../types/errors';

const COLOR_PALETTES: string[][] = [
  ['#ff6b6b', '#f39c12', '#f1c40f', '#3498db', '#9b59b6', '#e91e63'],
  ['#f87171', '#60a5fa', '#facc15', '#c084fc', '#fb923c', '#ec4899'],
  ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'],
  ['#dc2626', '#ea580c', '#2563eb', '#7c3aed', '#db2777', '#f472b6'],
  ['#be123c', '#c2410c', '#1e40af', '#6d28d9', '#be185d', '#a855f7'],
];

type QuoteResultsProps = {
  error: AppError | null;
  chartData: ChartDatum[];
  seriesMeta: string[];
  loading: boolean;
  onRetry?: () => void;
};

export function QuoteResults({ error, chartData, seriesMeta, loading, onRetry }: QuoteResultsProps) {
  const hasData = chartData.length > 0;
  const palette = useMemo(
    () => COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)],
    [seriesMeta.join(',')] // Recalcula apenas quando os tickers mudarem
  );

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-xl shadow-black/40">
      {error && <ErrorMessage error={error} onRetry={onRetry} />}

      {loading && <ChartSkeleton />}

      {!hasData && !error && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl opacity-50">📊</div>
          <p className="text-sm text-[var(--color-muted)]">
            Preencha o formulário acima para gerar o gráfico.
          </p>
        </div>
      )}

      {hasData && !loading && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--color-muted)]">
            <strong className="text-[var(--color-highlight)]">Resultados:</strong>
            <span>{seriesMeta.join(', ')}</span>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="#1f1f1f" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#808080" />
                <YAxis domain={['auto', 'auto']} stroke="#808080" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050505',
                    borderColor: '#1a1a1a',
                    color: '#e5e5e5',
                  }}
                />
                <Legend />
                {seriesMeta.map((ticker, index) => (
                  <Line
                    key={ticker}
                    type="monotone"
                    dataKey={ticker}
                    stroke={palette[index % palette.length]}
                    strokeWidth={2}
                    dot={{ stroke: palette[index % palette.length], fill: '#050505', strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}

