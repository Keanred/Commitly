import { NextFunction, Request, Response } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
