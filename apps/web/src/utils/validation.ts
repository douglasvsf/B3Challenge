export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateTickers(tickers: string): string | null {
  const trimmed = tickers.trim();
  if (!trimmed) {
    return 'Informe pelo menos um ticker.';
  }

  const tickerList = trimmed.split(/[,\s]+/).map((t) => t.trim().toUpperCase()).filter(Boolean);
  if (tickerList.length === 0) {
    return 'Informe pelo menos um ticker válido.';
  }

  if (tickerList.length > 10) {
    return 'Máximo de 10 tickers por consulta.';
  }

  const invalidTickers = tickerList.filter((t) => !/^[A-Z]{4}\d{1,2}$/.test(t));
  if (invalidTickers.length > 0) {
    return `Tickers inválidos: ${invalidTickers.join(', ')}. Use o formato AAAA11 (ex: PETR4).`;
  }

  return null;
}

export function validateDateRange(start: string, end: string): string | null {
  if (!start || !end) {
    return 'Selecione ambas as datas.';
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Datas inválidas.';
  }

  if (startDate > endDate) {
    return 'A data inicial deve ser anterior à data final.';
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (startDate > today) {
    return 'A data inicial não pode ser no futuro.';
  }

  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    return 'O intervalo máximo é de 365 dias.';
  }

  if (daysDiff < 1) {
    return 'O intervalo mínimo é de 1 dia.';
  }

  return null;
}

export function validateForm(tickers: string, startDate: string, endDate: string): ValidationResult {
  const errors: Record<string, string> = {};

  const tickerError = validateTickers(tickers);
  if (tickerError) {
    errors.tickers = tickerError;
  }

  const dateError = validateDateRange(startDate, endDate);
  if (dateError) {
    errors.dates = dateError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

