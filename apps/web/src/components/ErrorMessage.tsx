import { AppError } from '../types/errors';

type ErrorMessageProps = {
  error: AppError;
  onRetry?: () => void;
  onDismiss?: () => void;
};

export function ErrorMessage({ error, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div
      className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${
        error.type === 'NETWORK'
          ? 'border-yellow-400/50 bg-yellow-900/30 text-yellow-200'
          : error.type === 'VALIDATION'
          ? 'border-orange-400/50 bg-orange-900/30 text-orange-200'
          : 'border-red-400/50 bg-red-900/30 text-red-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-semibold">{error.message}</p>
          {error.type === 'NETWORK' && (
            <p className="mt-1 text-xs opacity-80">Verifique sua conexão ou se o servidor está rodando.</p>
          )}
        </div>
        <div className="flex gap-2">
          {error.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="rounded px-3 py-1 text-xs font-semibold transition hover:opacity-80 underline"
            >
              Tentar novamente
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="rounded px-2 py-1 text-xs opacity-70 transition hover:opacity-100"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

