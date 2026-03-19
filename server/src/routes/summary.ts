import { Router, Request, Response } from 'express';

const summaryRouter = Router();

// Weekly OpenAI-generated digest
summaryRouter.get('/weekly', (req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default summaryRouter;
