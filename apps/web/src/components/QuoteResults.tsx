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

const COLOR_PALETTES: string[][] = [
  ['#00e6b0', '#1effd2', '#00b894', '#3df7c7', '#2ed1a8', '#54ffc6'],
  ['#ff6b6b', '#f39c12', '#f1c40f', '#3498db', '#9b59b6', '#e91e63'],
  ['#4ade80', '#f87171', '#60a5fa', '#facc15', '#c084fc', '#fb923c'],
];

type QuoteResultsProps = {
  error: string;
  chartData: ChartDatum[];
  seriesMeta: string[];
};

export function QuoteResults({ error, chartData, seriesMeta }: QuoteResultsProps) {
  const hasData = chartData.length > 0;
  const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-xl shadow-black/40">
      {error && (
        <p className="mb-4 rounded-lg border border-red-400/50 bg-red-900/30 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </p>
      )}

      {!hasData && !error && (
        <p className="text-sm text-[var(--color-muted)]">Preencha o formulário acima para gerar o gráfico.</p>
      )}

      {hasData && (
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

