export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  API = 'API',
  UNKNOWN = 'UNKNOWN',
}

export type AppError = {
  type: ErrorType;
  message: string;
  recoverable: boolean;
  retryable?: boolean;
};

export function createError(
  type: ErrorType,
  message: string,
  recoverable = false,
  retryable = false
): AppError {
  return { type, message, recoverable, retryable };
}

export function parseApiError(error: unknown): AppError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createError(
      ErrorType.NETWORK,
      'Erro de conexão. Verifique sua internet e tente novamente.',
      true,
      true
    );
  }

  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return createError(
        ErrorType.NETWORK,
        'Não foi possível conectar ao servidor. Verifique se a API está rodando.',
        true,
        true
      );
    }

    if (error.message.includes('400')) {
      return createError(
        ErrorType.VALIDATION,
        error.message || 'Dados inválidos. Verifique os campos do formulário.',
        true,
        false
      );
    }

    if (error.message.includes('500')) {
      return createError(
        ErrorType.API,
        'Erro interno do servidor. Tente novamente em alguns instantes.',
        true,
        true
      );
    }

    return createError(ErrorType.API, error.message, true, true);
  }

  return createError(ErrorType.UNKNOWN, 'Ocorreu um erro inesperado.', false, false);
}

