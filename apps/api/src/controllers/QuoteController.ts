import { Request, Response } from 'express';
import { QuoteQuery, QuoteResponse, ApiProvider } from '../types';
import { B3Service } from '../services/B3Service';
import { BrapiService } from '../services/BrapiService';

export class QuoteController {
  private b3Service: B3Service;
  private brapiService: BrapiService;

  constructor() {
    this.b3Service = new B3Service();
    this.brapiService = new BrapiService();
  }

  /**
   * Busca cotações de ativos da B3
   * GET /quotes?tickers=PETR4,VALE3&start=2024-01-01&end=2024-01-31&api=yahoo|brapi
   */
  async getQuotes(req: Request<{}, QuoteResponse | { error: string }, {}, QuoteQuery>, res: Response): Promise<void> {
    try {
      const { tickers = '', start, end, api } = req.query;
      
      // Valida o provider da API - verifica explicitamente o valor recebido
      const apiParam = typeof api === 'string' ? api.toLowerCase().trim() : 'yahoo';
      const apiProvider: ApiProvider = apiParam === 'brapi' ? 'brapi' : 'yahoo';

      // Valida e processa tickers
      const requestedTickers = tickers
        .split(/[,\s]+/)
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean);

      if (!requestedTickers.length) {
        res.status(400).json({ error: 'Informe ao menos um ticker em "tickers".' });
        return;
      }

      // Valida datas
      if (!start || !end) {
        res.status(400).json({ error: 'Os parâmetros "start" e "end" são obrigatórios (YYYY-MM-DD).' });
        return;
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (Number.isNaN(startDate.valueOf()) || Number.isNaN(endDate.valueOf())) {
        res.status(400).json({ error: 'Datas inválidas. Use o formato YYYY-MM-DD.' });
        return;
      }

      if (startDate > endDate) {
        res.status(400).json({ error: 'A data inicial deve ser anterior ou igual à data final.' });
        return;
      }

      // Valida que a data não é muito antiga (Yahoo Finance tem limitações)
      const minDate = new Date('1970-01-01');
      if (startDate < minDate) {
        res.status(400).json({ error: 'A data inicial não pode ser anterior a 1970-01-01.' });
        return;
      }

      // Valida que a data não é futura
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (endDate > today) {
        res.status(400).json({ error: 'A data final não pode ser futura.' });
        return;
      }

      // Busca cotações reais usando a API selecionada
      const service = apiProvider === 'brapi' ? this.brapiService : this.b3Service;
      const series = await service.getMultipleQuotes(requestedTickers, startDate, endDate);

      // Filtra séries que tiveram erro (sem pontos)
      const validSeries = series.filter((s) => s.points.length > 0);
      const invalidTickers = series.filter((s) => s.points.length === 0).map((s) => s.ticker);

      if (validSeries.length === 0) {
        res.status(404).json({
          error: `Nenhum dado encontrado para os tickers informados: ${requestedTickers.join(', ')}. Tickers inválidos: ${invalidTickers.join(', ')}`,
        });
        return;
      }

      // Se alguns tickers falharam, retorna warning mas ainda retorna os dados válidos
      const response: QuoteResponse = {
        tickers: validSeries.map((s) => s.ticker),
        range: {
          start: this.formatDate(startDate),
          end: this.formatDate(endDate),
        },
        series: validSeries,
      };

      // Adiciona header indicando qual API foi usada
      res.setHeader('X-API-Used', apiProvider);
      
      // Se houver tickers inválidos, adiciona aviso no header
      if (invalidTickers.length > 0) {
        res.setHeader('X-Warning', `Tickers sem dados: ${invalidTickers.join(', ')}`);
      }

      res.json(response);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar cotações';
      res.status(500).json({ error: errorMessage });
    }
  }

  /**
   * Formata data para YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}

