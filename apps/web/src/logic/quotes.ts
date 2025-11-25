import { ChartDatum, QuoteQueryParams, QuoteResponse, QuoteSeries } from '../types/quotes';

export const DEFAULT_TICKERS = 'PETR4 VALE3';

// Polyfill para AbortSignal.timeout (compatibilidade)
function createTimeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && 'timeout' in AbortSignal) {
    return AbortSignal.timeout(ms);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  // Cleanup será feito quando o signal for abortado
  return controller.signal;
}

export async function fetchQuotes(params: QuoteQueryParams): Promise<QuoteResponse> {
  const searchParams = new URLSearchParams({
    tickers: params.tickers,
    start: params.start,
    end: params.end,
  });
  
  // Adiciona o parâmetro de API se fornecido
  if (params.api) {
    searchParams.append('api', params.api);
  }

  let response: Response;
  try {
    response = await fetch(`/quotes?${searchParams.toString()}`, {
      signal: createTimeoutSignal(10000), // 10s timeout
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error('Tempo de espera esgotado. Tente novamente.');
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Requisição cancelada ou tempo esgotado.');
    }
    throw error;
  }

  if (!response.ok) {
    const statusText = response.statusText || `Erro ${response.status}`;
    let errorMessage = `Erro ${response.status}: ${statusText}`;

    try {
      const payload = (await response.json()) as { error?: string } | null;
      if (payload?.error) {
        errorMessage = payload.error;
      }
    } catch {
      // Se não conseguir parsear JSON, usa a mensagem padrão
    }

    throw new Error(errorMessage);
  }

  try {
    return (await response.json()) as QuoteResponse;
  } catch (error) {
    throw new Error('Erro ao processar resposta da API. Formato inválido.');
  }
}

export function normalizeChartData(series: QuoteSeries[] = []): ChartDatum[] {
  const map = new Map<string, ChartDatum>();

  series.forEach(({ ticker, points }) => {
    points.forEach(({ date, close }) => {
      const existing = map.get(date) ?? { date };
      existing[ticker] = close;
      map.set(date, existing);
    });
  });

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function addDays(date: Date, amount: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

