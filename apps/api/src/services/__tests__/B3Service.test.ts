import axios from 'axios';
import { B3Service } from '../B3Service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('B3Service', () => {
  let service: B3Service;
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  beforeEach(() => {
    service = new B3Service();
    jest.clearAllMocks();
  });

  it('deve buscar cotações com sucesso', async () => {
    const mockResponse = {
      data: {
        chart: {
          result: [
            {
              timestamp: [1704067200, 1704153600],
              indicators: {
                quote: [{ close: [25.50, 26.00] }],
              },
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getQuotes('PETR4', startDate, endDate);

    expect(result.ticker).toBe('PETR4');
    expect(result.points).toHaveLength(2);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('PETR4.SA'),
      expect.any(Object)
    );
  });

  it('deve adicionar .SA ao ticker brasileiro', async () => {
    const mockResponse = {
      data: {
        chart: {
          result: [
            {
              timestamp: [1704067200],
              indicators: { quote: [{ close: [25.50] }] },
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    await service.getQuotes('VALE3', startDate, endDate);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('VALE3.SA'),
      expect.any(Object)
    );
  });

  it('deve filtrar valores nulos', async () => {
    const mockResponse = {
      data: {
        chart: {
          result: [
            {
              timestamp: [1704067200, 1704153600, 1704240000],
              indicators: {
                quote: [{ close: [25.50, null, 26.00] }],
              },
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const result = await service.getQuotes('PETR4', startDate, endDate);

    expect(result.points.length).toBeGreaterThan(0);
    expect(result.points.every((p) => p.close !== null)).toBe(true);
  });

  it('deve buscar múltiplos tickers', async () => {
    const mockResponse = {
      data: {
        chart: {
          result: [
            {
              timestamp: [1704067200],
              indicators: { quote: [{ close: [25.50] }] },
            },
          ],
        },
      },
    };

    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await service.getMultipleQuotes(['PETR4', 'VALE3'], startDate, endDate);

    expect(result).toHaveLength(2);
    expect(result[0].ticker).toBe('PETR4');
    expect(result[1].ticker).toBe('VALE3');
  });
});
