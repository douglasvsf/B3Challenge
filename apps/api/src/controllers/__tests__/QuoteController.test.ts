import { Request, Response } from 'express';
import { QuoteController } from '../QuoteController';
import { B3Service } from '../../services/B3Service';
import { BrapiService } from '../../services/BrapiService';

jest.mock('../../services/B3Service');
jest.mock('../../services/BrapiService');

describe('QuoteController', () => {
  let controller: QuoteController;
  let mockB3Service: jest.Mocked<B3Service>;
  let mockBrapiService: jest.Mocked<BrapiService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockB3Service = {
      getMultipleQuotes: jest.fn(),
    } as any;

    mockBrapiService = {
      getMultipleQuotes: jest.fn(),
    } as any;

    (B3Service as jest.Mock).mockImplementation(() => mockB3Service);
    (BrapiService as jest.Mock).mockImplementation(() => mockBrapiService);

    controller = new QuoteController();

    mockRequest = { query: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
    };
  });

  it('deve retornar erro quando tickers estiver vazio', async () => {
    mockRequest.query = { tickers: '', start: '2024-01-01', end: '2024-01-31' };

    await controller.getQuotes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Informe ao menos um ticker em "tickers".',
    });
  });

  it('deve retornar erro quando datas estiverem ausentes', async () => {
    mockRequest.query = { tickers: 'PETR4' };

    await controller.getQuotes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Os parâmetros "start" e "end" são obrigatórios (YYYY-MM-DD).',
    });
  });

  it('deve usar Yahoo Finance por padrão', async () => {
    mockB3Service.getMultipleQuotes.mockResolvedValue([
      { ticker: 'PETR4', points: [{ date: '2024-01-02', close: 25.50 }] },
    ]);

    mockRequest.query = {
      tickers: 'PETR4',
      start: '2024-01-01',
      end: '2024-01-31',
    };

    await controller.getQuotes(mockRequest as Request, mockResponse as Response);

    expect(mockB3Service.getMultipleQuotes).toHaveBeenCalled();
    expect(mockBrapiService.getMultipleQuotes).not.toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-API-Used', 'yahoo');
  });

  it('deve usar BRAPI quando api=brapi', async () => {
    mockBrapiService.getMultipleQuotes.mockResolvedValue([
      { ticker: 'PETR4', points: [{ date: '2024-01-02', close: 25.50 }] },
    ]);

    mockRequest.query = {
      tickers: 'PETR4',
      start: '2024-01-01',
      end: '2024-01-31',
      api: 'brapi',
    };

    await controller.getQuotes(mockRequest as Request, mockResponse as Response);

    expect(mockBrapiService.getMultipleQuotes).toHaveBeenCalled();
    expect(mockB3Service.getMultipleQuotes).not.toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('X-API-Used', 'brapi');
  });

  it('deve retornar erro quando nenhum ticker válido for encontrado', async () => {
    mockB3Service.getMultipleQuotes.mockResolvedValue([
      { ticker: 'INVALID', points: [] },
    ]);

    mockRequest.query = {
      tickers: 'INVALID',
      start: '2024-01-01',
      end: '2024-01-31',
    };

    await controller.getQuotes(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });
});
