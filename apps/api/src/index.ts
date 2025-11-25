import express, { Request, Response } from 'express';
import cors from 'cors';
import quotesRoutes from './routes/quotes.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.get('/', (_: Request, res: Response) => {
  res.send('API online');
});

app.get('/health', (_: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/', quotesRoutes);

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

