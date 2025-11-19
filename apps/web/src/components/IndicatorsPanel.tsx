import { Indicator, formatCurrency, formatPercent } from '../utils/indicators';

type IndicatorsPanelProps = {
  indicators: Indicator[];
};

export function IndicatorsPanel({ indicators }: IndicatorsPanelProps) {
  if (indicators.length === 0) return null;

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {indicators.map((indicator) => (
        <div
          key={indicator.ticker}
          className="rounded-xl border border-[var(--color-border)] bg-[#050505] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--color-highlight)]">{indicator.ticker}</h3>
            <span
              className={`text-sm font-semibold ${
                indicator.variationPercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {formatPercent(indicator.variationPercent)}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Preço Atual:</span>
              <span className="font-semibold text-[var(--color-text)]">
                {formatCurrency(indicator.currentPrice)}
              </span>
            </div>

            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Variação:</span>
              <span
                className={`font-semibold ${
                  indicator.variation >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(indicator.variation)}
              </span>
            </div>

            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Máxima:</span>
              <span className="font-semibold text-[var(--color-text)]">
                {formatCurrency(indicator.highest)}
              </span>
            </div>

            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Mínima:</span>
              <span className="font-semibold text-[var(--color-text)]">
                {formatCurrency(indicator.lowest)}
              </span>
            </div>

            {indicator.movingAverage7 && (
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>MM7:</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formatCurrency(indicator.movingAverage7)}
                </span>
              </div>
            )}

            {indicator.movingAverage30 && (
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>MM30:</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {formatCurrency(indicator.movingAverage30)}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

