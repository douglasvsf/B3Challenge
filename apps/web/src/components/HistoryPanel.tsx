import { useState, useEffect } from 'react';
import { HistoryEntry, getHistory, clearHistory, removeHistoryEntry, formatHistoryDate } from '../utils/history';
import { QuoteQueryParams, ApiProvider } from '../types/quotes';

type HistoryPanelProps = {
  onSelectHistory: (params: QuoteQueryParams) => void;
};

export function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshHistory = () => {
    setHistory(getHistory());
  };

  useEffect(() => {
    refreshHistory();
    
    // Atualiza o histórico quando o localStorage mudar (outra aba/componente)
    const handleStorageChange = () => {
      refreshHistory();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Polling para detectar mudanças no mesmo contexto (já que storage event só funciona entre abas)
    const interval = setInterval(refreshHistory, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSelect = (entry: HistoryEntry) => {
    onSelectHistory(entry.params);
    setIsOpen(false);
  };

  const handleClear = () => {
    if (window.confirm('Deseja limpar todo o histórico?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleRemove = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeHistoryEntry(id);
    refreshHistory();
  };

  if (history.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-[var(--color-border)] bg-[#050505] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[#0a0a0a] hover:border-[var(--color-primary)]"
      >
        📚 Histórico ({history.length})
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-highlight)]">Consultas Recentes</h3>
              <button
                onClick={handleClear}
                className="text-xs text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
              >
                Limpar
              </button>
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="group rounded-lg border border-[var(--color-border)] bg-[#050505] p-3 transition hover:border-[var(--color-primary)]"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-semibold text-[var(--color-text)]">
                          {entry.params.tickers}
                        </div>
                        {entry.params.api && (
                          <span className="rounded bg-[var(--color-primary)]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[var(--color-primary)]">
                            {entry.params.api === 'brapi' ? 'BRAPI' : 'Yahoo'}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-muted)]">
                        {entry.params.start} → {entry.params.end}
                      </div>
                      <div className="mt-1 text-xs text-[var(--color-muted)]">
                        {formatHistoryDate(entry.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleRemove(entry.id, e)}
                      className="ml-2 opacity-0 transition group-hover:opacity-100"
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                  <button
                    onClick={() => handleSelect(entry)}
                    className="w-full rounded bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-black transition hover:bg-[var(--color-primary-dark)]"
                  >
                    Usar esta consulta
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

