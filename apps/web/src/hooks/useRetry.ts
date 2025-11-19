import { useState, useCallback } from 'react';

type RetryOptions = {
  maxRetries?: number;
  delay?: number;
  onRetry?: (attempt: number) => void;
};

export function useRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
) {
  const { maxRetries = 3, delay = 1000, onRetry } = options;
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T>> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            setIsRetrying(true);
            onRetry?.(attempt);
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
          }

          const result = await fn(...args);
          setRetryCount(0);
          setIsRetrying(false);
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');

          if (attempt === maxRetries) {
            setRetryCount(attempt);
            setIsRetrying(false);
            throw lastError;
          }
        }
      }

      throw lastError || new Error('Retry failed');
    },
    [fn, maxRetries, delay, onRetry]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    reset,
  };
}

