import { Router, Request, Response } from 'express';
import { QuoteController } from '../controllers/QuoteController';

const router: Router = Router();
const quoteController = new QuoteController();

router.get('/quotes', (req: Request, res: Response) => {
  quoteController.getQuotes(req, res);
});

export default router;

