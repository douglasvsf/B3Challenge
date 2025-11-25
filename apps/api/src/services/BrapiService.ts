import axios from 'axios';
import { QuoteSeries, QuotePoint } from '../types';

export class BrapiService {
  private readonly brapiBaseUrl = process.env.BRAPI_BASE_URL || 'https://brapi.dev/api';

  /**
   * Busca cotações reais da B3 usando BRAPI
   * A BRAPI é uma API brasileira gratuita para cotações da B3
   */
  async getQuotes(ticker: string, startDate: Date, endDate: Date): Promise<QuoteSeries> {
    try {
      // BRAPI usa o endpoint /quote/{ticker} com parâmetros range e interval
      const formattedTicker = ticker.toUpperCase().trim();
      
      // Calcula o range em dias
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // BRAPI aceita ranges: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
      const range = this.calculateRange(daysDiff);
      const url = `${this.brapiBaseUrl}/quote/${formattedTicker}?range=${range}&interval=1d`;

      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Accept': 'application/json',
        },
      });

      // BRAPI retorna { results: [{ symbol, historicalDataPrice: [...] }] }
      const results = response.data?.results;
      
      if (!results || results.length === 0) {
        throw new Error(`Nenhum dado encontrado para o ticker ${ticker}`);
      }

      const result = results[0];

      // BRAPI retorna histórico em result.historicalDataPrice (array de objetos com date e close)
      const historicalData = result?.historicalDataPrice || [];
      
      if (historicalData.length === 0) {
        throw new Error(`Nenhum dado de cotação disponível para ${ticker} no período especificado`);
      }

      // Filtra dados dentro do período solicitado
      // BRAPI retorna date como timestamp em milissegundos ou string
      const points: QuotePoint[] = [];
      for (const item of historicalData) {
        let itemDate: Date;
        
        // BRAPI pode retornar date como timestamp (ms) ou string
        if (typeof item.date === 'number') {
          // Se for timestamp, verifica se está em segundos ou milissegundos
          itemDate = new Date(item.date > 1e12 ? item.date : item.date * 1000);
        } else if (typeof item.date === 'string') {
          itemDate = new Date(item.date);
        } else {
          continue; // Ignora se não conseguir parsear
        }
        
        // Normaliza as datas para comparação (remove horas)
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        // Verifica se está dentro do range solicitado
        if (itemDateOnly >= startDateOnly && itemDateOnly <= endDateOnly) {
          const close = item.close;
          
          if (close !== null && close !== undefined && !isNaN(close)) {
            points.push({
              date: this.formatDate(itemDate),
              close: Number(close.toFixed(2)),
            });
          }
        }
      }

      // Se não encontrou dados no período, tenta buscar todos e filtrar
      if (points.length === 0) {
        // Ordena por data e pega os mais próximos do período
        const sortedData = historicalData
          .map((item: any) => ({
            date: new Date(item.date * 1000),
            close: item.close,
          }))
          .filter((item: any) => item.close !== null && item.close !== undefined && !isNaN(item.close))
          .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());

        if (sortedData.length > 0) {
          // Pega os dados mais próximos do período solicitado
          for (const item of sortedData) {
            if (item.date >= startDate && item.date <= endDate) {
              points.push({
                date: this.formatDate(item.date),
                close: Number(item.close.toFixed(2)),
              });
            }
          }
        }
      }

      if (points.length === 0) {
        throw new Error(`Nenhum dado válido encontrado para ${ticker} no período especificado`);
      }

      // Ordena por data
      points.sort((a, b) => a.date.localeCompare(b.date));

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
   * Calcula o range apropriado para BRAPI baseado na diferença de dias
   */
  private calculateRange(days: number): string {
    if (days <= 5) return '5d';
    if (days <= 30) return '1mo';
    if (days <= 90) return '3mo';
    if (days <= 180) return '6mo';
    if (days <= 365) return '1y';
    if (days <= 730) return '2y';
    if (days <= 1825) return '5y';
    if (days <= 3650) return '10y';
    return 'max';
  }

  /**
   * Formata data para YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}

