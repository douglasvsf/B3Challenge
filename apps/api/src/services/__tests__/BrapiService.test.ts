import axios from 'axios';
import { BrapiService } from '../BrapiService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BrapiService', () => {
  let service: BrapiService;
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  beforeEach(() => {
    service = new BrapiService();
    jest.clearAllMocks();
  });

  it('deve buscar cotações com sucesso', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            symbol: 'PETR4',
            historicalDataPrice: [
              {
                date: new Date('2024-01-02').getTime(),
                close: 25.50,
              },
              {
                date: new Date('2024-01-03').getTime(),
                close: 26.00,
              },
            ],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getQuotes('PETR4', startDate, endDate);

    expect(result.ticker).toBe('PETR4');
    expect(result.points.length).toBeGreaterThan(0);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('PETR4'),
      expect.any(Object)
    );
  });

  it('deve filtrar dados dentro do período solicitado', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            symbol: 'PETR4',
            historicalDataPrice: [
              {
                date: new Date('2023-12-30').getTime(),
                close: 24.00,
              },
              {
                date: new Date('2024-01-02').getTime(),
                close: 25.50,
              },
              {
                date: new Date('2024-02-01').getTime(),
                close: 27.00,
              },
            ],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getQuotes('PETR4', startDate, endDate);

    expect(result.points.every((p) => {
      const pointDate = new Date(p.date);
      return pointDate >= startDate && pointDate <= endDate;
    })).toBe(true);
  });

  it('deve filtrar valores nulos', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            symbol: 'PETR4',
            historicalDataPrice: [
              {
                date: new Date('2024-01-02').getTime(),
                close: 25.50,
              },
              {
                date: new Date('2024-01-03').getTime(),
                close: null,
              },
              {
                date: new Date('2024-01-04').getTime(),
                close: 26.00,
              },
            ],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getQuotes('PETR4', startDate, endDate);

    expect(result.points.every((p) => p.close !== null && !isNaN(p.close))).toBe(true);
  });

  it('deve buscar múltiplos tickers', async () => {
    const mockResponse = {
      data: {
        results: [
          {
            symbol: 'PETR4',
            historicalDataPrice: [
              {
                date: new Date('2024-01-02').getTime(),
                close: 25.50,
              },
            ],
          },
        ],
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.getMultipleQuotes(['PETR4', 'VALE3'], startDate, endDate);

    expect(result).toHaveLength(2);
    expect(result[0].ticker).toBe('PETR4');
    expect(result[1].ticker).toBe('VALE3');
  });
});
