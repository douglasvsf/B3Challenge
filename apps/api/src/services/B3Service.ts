import axios from 'axios';
import { QuoteSeries, QuotePoint } from '../types';

export class B3Service {
  private readonly yahooFinanceBaseUrl = process.env.YAHOO_FINANCE_BASE_URL || 'https://query1.finance.yahoo.com/v8/finance/chart';

  /**
   * Busca cotações reais da B3 usando Yahoo Finance API
   * Para ações brasileiras, o formato é TICKER.SA (ex: PETR4.SA)
   */
  async getQuotes(ticker: string, startDate: Date, endDate: Date): Promise<QuoteSeries> {
    try {
      // Converte ticker brasileiro para formato Yahoo Finance (adiciona .SA)
      const yahooTicker = this.formatTickerForYahoo(ticker);
      
      // Converte datas para timestamps Unix
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      const url = `${this.yahooFinanceBaseUrl}/${yahooTicker}?period1=${startTimestamp}&period2=${endTimestamp}&interval=1d`;

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      });

      const result = response.data?.chart?.result?.[0];
      
      if (!result) {
        throw new Error(`Nenhum dado encontrado para o ticker ${ticker}`);
      }

      const timestamps = result.timestamp || [];
      const closes = result.indicators?.quote?.[0]?.close || [];

      if (timestamps.length === 0 || closes.length === 0) {
        throw new Error(`Nenhum dado de cotação disponível para ${ticker} no período especificado`);
      }

      // Filtra apenas dias úteis (remove valores null/undefined)
      const points: QuotePoint[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        const timestamp = timestamps[i];
        const close = closes[i];
        
        // Ignora valores nulos (finais de semana, feriados)
        if (close !== null && close !== undefined && !isNaN(close)) {
          const date = new Date(timestamp * 1000);
          points.push({
            date: this.formatDate(date),
            close: Number(close.toFixed(2)),
          });
        }
      }

      if (points.length === 0) {
        throw new Error(`Nenhum dado válido encontrado para ${ticker} no período especificado`);
      }

      return {
        ticker,
        points,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error(`Ticker ${ticker} não encontrado`);
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error(`Timeout ao buscar dados para ${ticker}`);
        }
        throw new Error(`Erro ao buscar dados para ${ticker}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Busca cotações para múltiplos tickers em paralelo
   */
  async getMultipleQuotes(
    tickers: string[],
    startDate: Date,
    endDate: Date
  ): Promise<QuoteSeries[]> {
    const promises = tickers.map((ticker) =>
      this.getQuotes(ticker, startDate, endDate).catch(() => {
        // Retorna série vazia em caso de erro, mas mantém o ticker
        return {
          ticker,
          points: [],
        };
      })
    );

    return Promise.all(promises);
  }

  /**
   * Formata ticker brasileiro para formato Yahoo Finance
   * Ex: PETR4 -> PETR4.SA
   */
  private formatTickerForYahoo(ticker: string): string {
    const upperTicker = ticker.toUpperCase().trim();
    // Se já termina com .SA, retorna como está
    if (upperTicker.endsWith('.SA')) {
      return upperTicker;
    }
    // Adiciona .SA para ações brasileiras
    return `${upperTicker}.SA`;
  }

  /**
   * Formata data para YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}

