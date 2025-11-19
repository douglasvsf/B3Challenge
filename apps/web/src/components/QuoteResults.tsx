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

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f97316', '#7c3aed', '#0891b2'] as const;

type QuoteResultsProps = {
  error: string;
  chartData: ChartDatum[];
  seriesMeta: string[];
};

export function QuoteResults({ error, chartData, seriesMeta }: QuoteResultsProps) {
  const hasData = chartData.length > 0;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5">
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {!hasData && !error && (
        <p className="text-sm text-slate-500">Preencha o formulário acima para gerar o gráfico.</p>
      )}

      {hasData && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
            <strong className="text-slate-900">Resultados:</strong>
            <span>{seriesMeta.join(', ')}</span>
          </div>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
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
  );
}

