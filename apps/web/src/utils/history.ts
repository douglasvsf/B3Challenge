import { QuoteQueryParams, QuoteResponse } from '../types/quotes';

export type HistoryEntry = {
  id: string;
  timestamp: number;
  params: QuoteQueryParams;
  result: QuoteResponse;
};

const HISTORY_KEY = 'b3challenge_history';
const MAX_HISTORY = 10;

export function saveToHistory(params: QuoteQueryParams, result: QuoteResponse): void {
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      params,
      result,
    };

    // Remove duplicatas (mesmos tickers, datas e API)
    // Normaliza API para comparação (undefined/null são tratados como 'yahoo' padrão)
    const normalizedApi = params.api || 'yahoo';
    const filtered = history.filter(
      (entry) => {
        const entryApi = entry.params.api || 'yahoo';
        return (
          entry.params.tickers !== params.tickers ||
          entry.params.start !== params.start ||
          entry.params.end !== params.end ||
          entryApi !== normalizedApi
        );
      }
    );

    // Adiciona no início e limita ao máximo
    const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Erro ao salvar histórico:', error);
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryEntry[];
  } catch (error) {
    console.warn('Erro ao ler histórico:', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn('Erro ao limpar histórico:', error);
  }
}

export function removeHistoryEntry(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter((entry) => entry.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Erro ao remover entrada do histórico:', error);
  }
}

export function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

