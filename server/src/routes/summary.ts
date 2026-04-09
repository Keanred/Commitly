import { Request, Response, Router } from 'express';

const summaryRouter = Router();

// Weekly OpenAI-generated digest
summaryRouter.get('/weekly', (_req: Request, res: Response) => {
  res.status(501).json({ error: 'Not implemented' });
});

export default summaryRouter;
